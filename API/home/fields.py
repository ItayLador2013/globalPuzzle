FIELDS = {
    "Engineering": {"catagories": {"stem": 1, "quant": 1, "creativity": .76}, "related": {"Mathematics": .80, "Business": .1, "Medicine": .05, "Law": .005, "Communications": .15, "Architecture": .20, "Design": .05, "Physics": .70, "Chemistry": .60, "Biology": .50, "Computer Science": .90,}},
    "Mathematics":  {"catagories": {"stem": 1, "quant": 1, "creativity": .2}, "related": {"Engineering": .80,  "Business": .25, "Medicine": .15, "Law": .125, "Education": .005, "Communications": .10, "Architecture": .20, "Design": .005, "Physics": .70, "Chemistry": .60, "Biology": .50, "Computer Science": .90,}},
    "Humanities": {"catagories": {"arts": 1, "social": 1}, "related": {"Arts": .80, "Business": .30, "Medicine": .10, "Law": .08, "Education": .10, "Psychology": .50, "Communications": .50, "Agriculture": .1, "Nursing": .1, "Music": .40, "History": .70, "Philosophy": .70, "Anthropology": .3, "Linguistics": .2, "Theater": .3, "Public Health": .05, }},
    "Arts": {"catagories": {"arts": 1, "creativity": 1}, "related": {"Humanities": .70, "Psychology": .3, "Architecture": .80, "Design": .90, "Music": .30, "Marketing": .20, "Theater": .50}},
    "Business": {"catagories": {"world": 1, "quant": .2}, "related": {"Engineering": .05, "Mathematics": .05, "Law": .50, "Psychology": .05, "History": .50, "Computer Science": .005, "Economics": .70, "Marketing": .40, "Finance":.70,}},
    "Medicine":  {"catagories": {"health": 1, "science": .75}, "related": {"Law": .01, "Psychology": .20, "Nursing": 1, "Chemistry": .05, "Biology": .75, "Anthropology": .10, "Pharmacy": .80, "Public Health": .30,}},
    "Law":  {"catagories": {"social": 1, "quant": .30}, "related": {"Mathematics": .1, "Humanities": .01, "Business": .40, "History": .60, "Economics": .10, "Criminal Justice": 1, "Finance": .10,}},
    "Education":  {"catagories": {"social": .75,}, "related": {}},
    "Psychology":  {"catagories": {"social": 1, "science": .75}, "related": {"Humanities": .10, "Arts": .05, "Medicine": .30, "Biology": .25, "Sociology": .10, "Chemistry": .05, "Marketing": .10, "Religious Studies": .30}},
    "Communications":  {"catagories": {"social": 1}, "related": {"Humanities": .10, "Psychology": .15, "Sociology": .01, "Marketing": .15,}},
    "Agriculture": {"catagories": {"earth": 1, "science": .1}, "related": {"Humanities": .10, "Geology": .60, "Geography": .50}},
    "Architecture": {"catagories": {"earth": 1}, "related": {"Engineering": .45, "Mathematics": .60, "Arts": .02, "History": .01}},
    "Design": {"catagories": {"arts": 1}, "related": {"Engineering": .10, "Arts": 1, "Psychology": .005}},
    "Nursing": {"catagories": {"health": 1, "science": .15}, "related": {"Medicine": 1,}},
    "Music": {"catagories": {"arts": 1}, "related": {"Arts": .65}},
    "History": {"catagories": {"social": 1}, "related": {"Humanities": .10, "Business": .25, "Law": .50, "Communications": .001, "Economics": .20, "Political Science": .10, "Religious Studies": .15}},
    "Philosophy": {"catagories": {"social": 1}, "related": {"Humanities": .05, "Law": .01, "Psychology": .15, "History": .65, "Political Science": .20, "Religious Studies": .20,}},
    "Physics": {"catagories": {"stem": 1, "science": 1, "quant": .5}, "related": {"Engineering": .70, "Mathematics": .60, "Chemistry": .1,}},
    "Chemistry": {"catagories": {"stem": 1, "science": 1}, "related": {"Engineering": .50, "Mathematics": .35, }},
    "Biology": {"catagories": {"stem": 1, "science": 1}, "related": {"Engineering": .10, "Mathematics": .01, "Medicine": 1, "Nursing": .40, "Physics": .04, "Chemistry": .05, "Dentistry": .10, "Pharmacy": .90,}},
    "Computer Science": {"catagories": {"stem": 1, "science": .1, "quant": 1}, "related": {"Engineering": .95, "Mathematics": .30, "Arts": .001, "Business": .012, "Design": .05, "Physics": .10}},
    "Economics": {"catagories": {"world": 1, "quant": .1}, "related": {"Engineering": .05, "Mathematics": .1, "Humanities": .10, "Business": .95, "Agriculture": .02, "Philosophy": .01, "Political Science": .15, "Finance": .75,}},
    "Political Science": {"catagories": {"social": 1}, "related": {"Business": .65, "Law": .75, "History": .50, "Philosophy": .10, "Economics": .40, "Sociology": .01, "Criminal Justice": .10,}},
    "Sociology": {"catagories": {"social": 1, "science": .05}, "related": {"Humanities": .15, "Arts": .01, "Business": .10, "Law": .15, "Education": .15, "Communications": .15, "Agriculture": .15, "Design": .05, "History": .80, "Philosophy": .75, "Economics": .65, "Political Science": .70, "Anthropology": .20, "Linguistics": .65, "Criminal Justice": .70, "Religious Studies": .60,}},
    "Anthropology": {"catagories": {"social": 1, "science": .25}, "related": {"Humanities": .65, "Arts": .15, "Medicine": .70, "Psychology": .10, "History": .15, "Sociology": .15, "Linguistics": .10,}},
    "Geology": {"catagories": {"earth": 1}, "science": 1, "related": {"Agriculture": .35, "Architecture": .15, "Geography": .20}},
    "Linguistics": {"catagories": {"social": 1}, "related": {"Humanities": .10, "Business": .003, "Communications": .10, "History": .15, "Sociology": .008, "Religious Studies": .01,}},
    "Criminal Justice": {"catagories": {"social": 1}, "related": {"Law": 1,}},
    "Marketing": {"catagories": {"world": 1}, "related": {"Engineering": .10, "Humanities": .01, "Arts": .04, "Psychology": .20, "Design": .10, "Economics": .12, "Sociology": .08,}},
    "Finance": {"catagories": {"world": 1, "quant": .1}, "related": {"Mathematics": .50, "Business": .60, "Economics": .50,}},
    "Dentistry": {"catagories": {"health": 1, "science": .4}, "related": {"Medicine": 1, "Psychology": .01, "Nursing": .01, "Chemistry": .15, "Biology": .45, "Pharmacy": .25}},
    "Pharmacy": {"catagories": {"health": 1, "science": .6}, "related": {"Engineering": .25, "Mathematics": .05, "Medicine": .25, "Chemistry": .60, "Nutrition": .01}},
    "Theater": {"catagories": {"arts": 1}, "related": {"Humanities": .15, "Arts": .60, "History": .10, "Philosophy": .03, }},
    "Religious Studies": {"catagories": {"social": 1}, "related": {"Humanities": .05, "Arts": .001, "Law": .14, "History": .80, "Philosophy": .40, "Political Science": .13,}},
    "Public Health": {"catagories": {"health": 1, "science": .05}, "related": {"Medicine": 1, "Political Science": .30, "Economics": .04,}},
    "Environmental Science": {"catagories": {"earth": 1, "science": 1}, "related": {"Chemistry": .08, "Geology": .25, "Geography": .20}},
    "Geography": {"catagories": {"earth": 1, "science": .6}, "related": {"Agriculture": .04, "Political Science": .50,}},
    "Nutrition": {"catagories": {"natural": 1, "science": .2, "sport": .25}, "related": {"Medicine": .75}},
    "Sports Science": {"catagories": {"natural": 1, "science": .05, "sport": 1,}, "related": {"Medicine": .25, "Psychology": .10, "Business": .005}},
}


for field in FIELDS:
    if field != "Education" and field not in FIELDS["Education"]["related"]:
        FIELDS["Education"]["related"][field] = .01
        