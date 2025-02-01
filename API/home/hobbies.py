HOBBIES = {
    "soccer": {"sport": .75, "field": .25, "ball": .50, "contact": .50, "outdoor": .60,},
    "football": {"sport": .75, "field": .25, "ball": .50, "contact": .50, "outdoor": .60},
    "swimming": {"sport": .75, "water": .60, "cardio": .20},
    "golf": {"sport": .75, "ball": .50, "outdoor": .60},
    "tennis": {"sport": .75, "ball": .50},
    "basketball": {"sport": .75, "ball": .50, "contact": .50},
    "baseball": {"sport": .75, "ball": .50, "contact": .25},
    "hockey": {"sport": .75, "field": .15, "contact": .50, "outdoor": .10},
    "gymnastics": {"sport": .75},
    "skateboarding": {"sport": .75, "outdoor": .60},
    "boxing": {"sport": .75, "contact": .50},
    "martial art": {"sport": .75, "contact": .50},
    "martialArts": {"sport": .75, "contact": .50},
    "rugby": {"sport": .75, "field": .25, "contact": .50, "outdoor": .30},
    "skiing": {"sport": .75, "extreme": .75, "snow": .50, "outdoor": .60},
    "snowboarding": {"sport": .75, "extreme": .75, "snow": .50, "outdoor": .60},
    "volleyball": {"sport": .75, "ball": .50},
    "cycling": {"sport": .75, "nature": .15, "outdoor": .60},
    "running": {"sport": .75, "nature": .25, "cardio": .20, "outdoor": .60},
    "fishing": {"sport": .33, "nature": .4, "outdoor": .60},
    "hiking": {"sport": .33, "nature": .5, "travel": .5, "cardio": .20, "outdoor": .60},
    "driving": {"sport": .2, "travel": .2},
    "engineering": {"technology": .75},
    "coding": {"technology": .75},
    "robotics": {"technology": .75},
    "photography": {"technology": .33, "art": .4, "nature": .2, "home": .1, "outdoor": .60},
    "video games": {"technology": .33, "home": .45},
    "painting": {"art": .75},
    "sketching": {"art": .75},
    "theater": {"art": .4, "culture": .75},
    "music": {"art": .4, "music": .75},
    "crafting": {"art": .5, "home": .25},
    "guitar": {"art": .25, "music": .7},
    "piano": {"art": .25, "music": .7},
    "singing": {"art": .25, "music": .7},
    "drums": {"art": .25, "music": .7},
    "writing": {"art": .2, "home": .5, "culture": .75},
    "reading": {"culture": .75, "home": .5},
    "hunting": {"nature": .75, "sport": .33},
    "travel": {"nature": .33, "travel": .75},
    "scuba diving": {"extreme": .75, "nature": .5, "sport": .5, "water": .60},
    "rock climbing": {"extreme": .75, "nature": .5, "sport": .5},
    "skydiving": {"extreme": .75, "nature": .2, "sport": .25},
    "flying": {"travel": .33, "extreme": .5},
    "dancing": {"art": .75, "cardio": .20, "sport": .15},
    "politics": {"home": .65,},
    "tv": {"home": .80},
}

CATS = dict()

for hobbie in HOBBIES:
    for catagory in HOBBIES[hobbie]:
        try:
            cat = CATS[hobbie]
        except KeyError:
            CATS[catagory] = 0.0