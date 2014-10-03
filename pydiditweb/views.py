from pyramid.response import Response
from pyramid.view import view_config
from pyramid.config import Configurator

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    MyModel,
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
    return json.dumps(b.get('Todo', True), default=datetime_handler)

# Create a todo.
@view_config(route_name='create_todo', renderer='string')
def create_todo(request):
    new_todo = b.put('Todo',request.json_body['description'])
    return json.dumps(b.get('Todo', filter_by={'id': new_todo['id']}), default=datetime_handler)

# Edit a todo.
@view_config(route_name='edit_todo')
def edit_todo(request):
    update_todo = b.get('Todo', filter_by={'id': request.matchdict['id']})
    # Todo: Convert all timestamps to datetime in json_body so that the whole thing can be passed below.
    b.set_attributes(update_todo[0], {'description': request.json_body['description']})
    b.commit()
    return Response('OK')

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

