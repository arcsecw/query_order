MONGO_HOST = 'localhost'
MONGO_PORT = 27017
RESOURCE_METHODS = ['GET', 'POST', 'DELETE']
# Enable reads (GET), edits (PATCH) and deletes of individual items
# (defaults to read-only item access).
ITEM_METHODS = ['GET', 'PATCH', 'DELETE']

# Our API will expose two resources (MongoDB collections): 'people' and
# 'works'. In order to allow for proper data validation, we define beaviour
# and structure.

orders = {
     # We choose to override global cache-control directives for this resource.
    'cache_control': 'max-age=1,must-revalidate',
    'cache_expires': 1,

    'schema': {
        'order_nb': {
            'type': 'string',
            'required': True,
        },
        'name': {
            'type': 'string',
            'required': True,

        },
        'kuaidi': {
            'type': 'string',
            'required': True,
        },
        'phone': {
            'type': 'string',
            'required': True,
        },
        'send_status': {
            'type': 'string',
            'required': True,
        },
        'group_name': {
            'type': 'string',
            'required': True,
        },
        'add_by': {
            'type': 'string',
        },
    }
}

# The DOMAIN dict explains which resources will be available and how they will
# be accessible to the API consumer.
DOMAIN = {
    'orders': orders,
}
SENTINEL_MANAGEMENT_USERNAME = 'top'
SENTINEL_MANAGEMENT_PASSWORD = 'top'