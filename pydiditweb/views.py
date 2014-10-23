from pyramid.response import Response
from pyramid.view import view_config
from pyramid.config import Configurator

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    #MyModel,
    )

# We can't survive without it.
import pydiditbackend as b
b.initialize()

import json
import datetime

# Used for converting datetime in out json.
def datetime_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else obj

@view_config(route_name='pydidit', renderer='templates/pydidit.pt')
def pydidit(request):
#    try:
#        one = DBSession.query(MyModel).filter(MyModel.name == 'one').first()
#    except DBAPIError:
#        return Response(conn_err_msg, content_type='text/plain', status_int=500)
    return {}

# Grab all of our todos and return a big fat JSON ball of todo goodness.
@view_config(route_name='get_todos', renderer='string')
def get_todos(request):
    return json.dumps(b.get('Todo', filter_by={'state': 'active'}), default=datetime_handler)

@view_config(route_name='get_todo', renderer='string')
def get_todo(request):
    return json.dumps(b.get('Todo', filter_by={'id': request.matchdict['id']})[0], default=datetime_handler)

# Create a todo.
@view_config(route_name='create_todo', renderer='string')
def create_todo(request):
    new_todo = b.put('Todo',request.json_body['description'])
    return json.dumps(b.get('Todo', filter_by={'id': new_todo['id']}), default=datetime_handler)

# Edit a todo.
@view_config(route_name='edit_todo', renderer='string')
def edit_todo(request):
    update_todo = b.get('Todo', filter_by={'id': request.matchdict['id']})[0]
    control = None
    if 'pydiditweb_control' in request.json_body:
        control = request.json_body['pydiditweb_control']
        del request.json_body['pydiditweb_control']
    # Right now, you can only do one thing per call: set completed, move, update other attributes
    # These are in no particular order, really
    if request.json_body['state'] == 'completed':
        b.set_completed(update_todo)
    elif control is not None:
        if 'move_to_anchor' in control:
            update_todo['display_position'] = b.move(update_todo, anchor=control['move_to_anchor'], model_name='Todo')
        elif 'sink_all_the_way' in control and control['sink_all_the_way']:
            update_todo['display_position'] = b.move(update_todo, direction='sink', all_the_way=True)
    else:
        # Todo: Convert all timestamps to datetime in json_body so that the whole thing can be passed below.
        b.set_attributes(update_todo, {'description': request.json_body['description']})
    b.commit()
    return json.dumps(update_todo, default=datetime_handler)

@view_config(route_name='delete_todo')
def delete_todo(request):
    b.delete_from_db({'type': 'Todo', 'id': request.matchdict['id']})
    return Response('OK')

conn_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to run the "initialize_pydiditweb-backend_db" script
    to initialize your database tables.  Check your virtual
    environment's "bin" directory for this script and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.

After you fix the problem, please restart the Pyramid application to
try it again.
"""

