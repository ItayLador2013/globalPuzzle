import set_manager

# Load the set
my_set = set_manager.load_set("my_set.dat")

print(my_set)
# Add elements to the set
my_set.add("j")

# Save the set
set_manager.save_set("my_set.dat", my_set)