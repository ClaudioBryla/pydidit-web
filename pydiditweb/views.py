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

@view_config(route_name='get', renderer='string')
def get(request):
    model_type = request.matchdict['model_type']
    if model_type == 'todos':
        model_type = 'Todo'
    elif model_type == 'projects':
        model_type = 'Project'

    filter_by = {}
    if len(request.matchdict['id']) > 0:
        filter_by['id'] = request.matchdict['id'][0] # Not supporting multiple for now
    else:
        filter_by['state'] = 'active'

    return json.dumps(b.get(model_type, filter_by=filter_by), default=datetime_handler)

@view_config(route_name='create', renderer='string')
def create(request):
    model_type = request.matchdict['model_type']
    primary_descriptor = None
    if model_type == 'todos':
        model_type = 'Todo'
        primary_descriptor = 'description'
    elif model_type == 'projects':
        model_type = 'Project'
        primary_descriptor = 'description'

    new_thing = b.put(model_type, request.json_body[primary_descriptor])
    return json.dumps(b.get(model_type, filter_by={'id': new_thing['id']}), default=datetime_handler)

@view_config(route_name='edit', renderer='string')
def edit(request):
    model_type = request.matchdict['model_type']
    primary_descriptor = None
    if model_type == 'todos':
        model_type = 'Todo'
        primary_descriptor = 'description'
    elif model_type == 'projects':
        model_type = 'Project'
        primary_descriptor = 'description'

    to_update = b.get(model_type, filter_by={'id': request.matchdict['id']})[0]
    control = None
    if 'pydiditweb_control' in request.json_body:
        control = request.json_body['pydiditweb_control']
        del request.json_body['pydiditweb_control']
    # Right now, you can only do one thing per call: set completed, move, update other attributes
    # These are in no particular order, really
    if request.json_body['state'] == 'completed':
        b.set_completed(to_update)
    elif control is not None:
        if 'move_to_anchor' in control:
            to_update['display_position'] = b.move(to_update, anchor=control['move_to_anchor'], model_name=model_type)
        elif 'sink_all_the_way' in control and control['sink_all_the_way']:
            to_update['display_position'] = b.move(to_update, direction='sink', all_the_way=True)
    else:
        # Todo: Convert all timestamps to datetime in json_body so that the whole thing can be passed below.
        new_attributes = {}
        new_attributes[primary_descriptor] = request.json_body[primary_descriptor]
        b.set_attributes(to_update, new_attributes)
    # I don't really understand why this flush() is needed, but it is.  Without it, sqlalchemy/transaction does a rollback inside the backend when DBSession.close() is called.
    b.flush()
    b.commit()
    return json.dumps(to_update, default=datetime_handler)

@view_config(route_name='delete', renderer='string')
def delete(request):
    model_type = request.matchdict['model_type']
    primary_descriptor = None
    if model_type == 'todos':
        model_type = 'Todo'
    elif model_type == 'projects':
        model_type = 'Project'

    b.delete_from_db({'type': model_type, 'id': request.matchdict['id']})
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

