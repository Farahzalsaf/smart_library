import configparser

config = configparser.ConfigParser()
config.read('/Users/falsafwan002/Desktop/smart-library/smart-library/config.ini')

print("Sections:", config.sections())
for item in config.items():
    print(item)

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

