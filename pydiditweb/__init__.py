from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from .models import (
    DBSession,
    Base,
    )

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    config = Configurator(settings=settings)
    config.include('pyramid_chameleon')
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('pydidit', '/')
    
    # Model-shared routes
    config.add_route('get', '/api/{model_type}*id', request_method='GET')
    config.add_route('create', '/api/{model_type}', request_method='POST')
    config.add_route('edit', '/api/{model_type}/{id}', request_method='PUT')
    config.add_route('delete', '/api/{model_type}/{id}', request_method='DELETE')

    config.scan()
    return config.make_wsgi_app()
