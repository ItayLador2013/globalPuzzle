import pickle

# Function to initialize the set and save it to a file
def initialize_set(filename):
    my_set = list()
    save_set(filename, my_set)

# Function to load the set from a file
def load_set(filename):
    try:
        with open(filename, 'rb') as file:
            data = pickle.load(file)
            return list(data)
    except (FileNotFoundError, EOFError, pickle.UnpicklingError):
        initialize_set(filename)
        return None

# Function to save the set to a file
def save_set(filename, some_set):
    data = list(some_set)
    with open(filename, 'wb') as file:
        pickle.dump(data, file)


