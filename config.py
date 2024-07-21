import configparser

config = configparser.ConfigParser()
config.read('./config.ini')

# Database Configuration
DB_HOST = config['database']['host']
DB_PORT = config['database'].getint('port')
DB_USERNAME = config['database']['username']
DB_PASSWORD = config['database']['password']
DB_DATABASE = config['database']['database']

# Server Configuration
SERVER_HOST = config['server']['host']
SERVER_PORT = config['server'].getint('port')

# JWT Configuration
SECRET_KEY = config['secret']

# Logging Configuration
LOGGING_CONFIG = config['logging']['config']

# Email Configuration
EMAIL_HOST = config['email']['host']
EMAIL_PORT = config['email'].getint('port')
