//Date: 01.02.2024 - 04.02.2024 (upto question 29)
// Q1. Find total number of active users in the collection
//Pipeline Stages: 1. $match 2. $count
//Output
// {
//     "Active Users": 516
//   }
[
  {
    $match: {
      // Match the collection having given field and value
      isActive: true, // Give the field name and value for which you want to match
    },
  },
  {
    $count: "Active Users", //Count each document having that match result and store it into new given field
  },
],
  // Q2. Find average age of users
  //Pipeline Stages: 1. $group
  //Output
  // {
  //     "_id": null,
  //     "totalQuantity": 29.835
  //   }
  [
    {
      $group: {
        _id: null, // make whole collection a single document by giving nothing as id.

        totalQuantity: {
          // Second parameter is specifying the accumulator field(operator I think), Result of grouping and accumulating will be stored in this field
          $avg: "$age", //  $avg accumulator will give average of specified value in whole collection now.
        },
      },
    },
  ];
// Q3. Find average age of users based on gender (additional)
//Pipeline Stages: 1. $group
//Output
// {
//   "_id": "female",
//   "totalQuantity": 29.81854043392505
// }

// {
//     "_id": "male",
//     "totalQuantity": 29.851926977687626
//   }
[
  {
    $group: {
      _id: "$gender", // group all documents based on gender.

      totalQuantity: {
        // Second parameter is specifying the accumulator field(operator I think), Final result will get stored in this field
        $avg: "$age", //  $avg accumulator will give average of specified value for each groups(male, female).
      },
    },
  },
];
// Q4. List top 5 common fruits among the uses
//Pipeline Stages: 1. $group 2. $sort 3. $limit
//We can't specify $count stage after $group stage because it will not work
// (we don't want to calculate no. of documents for single value of a field(isActive:true in above case), we have three different values that means three groups of document will be created)
// Therefore we need to get count for each of these 3 groups which is achieved by $sum operator
//Output
// {
//     "_id": "banana",
//     "count": 339
//   }
// {
//     "_id": "apple",
//     "count": 338
//   }

// {
//     "_id": "strawberry",
//     "count": 323
//   }

[
  {
    $group: {
      _id: "$favoriteFruit", // group all documents based on value of favoriteFruit field. Outputs: Generates three groups naming apple banana, strawberry

      count: {
        // By specifying count inside $group stage we can apply operations to the each group
        // Second parameter is specifying the accumulator field(operator I think), Final result will get stored in this field
        $sum: 1, //  $sum accumulator will sum the no. of documents in each groups (banana, apple, strawberry). 1 specifies to increment the counter every time new document of same field value is found
      },
    },
  },

  // For sorting we'll have to pass result of grouping stage in the next pipeline stage
  // be sure to include at least one field in your sort that contains unique values, before passing results to the $limit stage.
  //E.g $sort:{count:-1,index:-1} this will help in sort with duplicating results
  {
    $sort: {
      count: -1, // sort the documents in descending order based on field we got from above stage of pipeline
    },
  },

  {
    $limit: 5, // limit the number of results to be returned. This way we will get only top 5 results after sorting is done
  },
];
// Q5. Find total number of male and females
//Pipeline Stages: 1. $group
//We can't specify $count stage after $group stage because it will not work
// (we don't want to calculate no. of documents for single value of a field(isActive:true in above case), we have three different values that means three groups of document will be created)
// Therefore we need to get count for each of these 3 groups which is achieved by $sum operator
//Output
// {
//     "_id": "male",
//     "count": 493
//   }
//   {
//     "_id": "female",
//     "count": 507
//   }

[
  {
    $group: {
      _id: "$gender", // group all documents based on value of gender field. Outputs: Generates two groups naming male, female

      count: {
        // By specifying count inside $group stage we can apply operations to the each group
        // Second parameter is specifying the accumulator field(operator I think), Final result will get stored in this field
        $sum: 1, //  $sum accumulator will sum the no. of documents in each groups (male,female). 1 specifies to increment the counter every time new document of same field value is found
      },
    },
  },
  // We don't need it here but still you can:
  // For sorting we'll have to pass result of grouping stage in the next pipeline stage

  {
    $sort: {
      count: -1, // sort the documents in descending order based on field we got from above stage of pipeline
    },
  },

  {
    $limit: 1, // limit the number of results to be returned. This way we will get only top 1 result after sorting is done
  },
];
// Q5. Which country has highest number of registered users?
//Pipeline Stages: 1. $group 2. $sort 3. $limit
//We can't specify $count stage after $group stage because it will not work
// (we don't want to calculate no. of documents for single value of a field(isActive:true in Q1),
//  we have lots of different values i.e germany, usa, france, italy. That means multiple groups of document will be created)
// Therefore we need to get count for each of these groups which is achieved by $sum operator
//Output
// {
//     "_id": "Germany",
//     "userCount": 261
//   }

[
  {
    $group: {
      _id: "$company.location.country", // group all documents based on value of nested field or embedded documents (document contains $company object and $country object has $location object in it. Further $location object has $country field). Outputs: Generates groups named: germany, usa, france, italy

      userCount: {
        // By specifying count inside $group stage we can apply operations to the each group
        // Second parameter is specifying the accumulator field(operator I think), Final result will get stored in this field
        $sum: 1, //  $sum accumulator will sum the no. of documents in each groups (germany, usa, france, italy). 1 specifies to increment the counter every time new document of same field value is found
      },
    },
  },
  // We don't need it here but still you can:
  // For sorting we'll have to pass result of grouping stage in the next pipeline stage

  {
    $sort: {
      userCount: -1, // sort the documents in descending order based on field we got from above stage of pipeline
    },
  },

  {
    $limit: 1, // limit the number of results to be returned. This way we will get country having highest number of users after sorting is done
  },
];

//Q6 List all the unique eye colours present in the collection
// Pipeline Stage: Only 1 i.e Group
//Output:
// {
//     "_id": "green",
//     "count": 330
//   }
//   {
//     "_id": "blue",
//     "count": 333
//   }
//   {
//     "count": 337,
//     "_id": "brown"
//   }

[
  {
    $group: {
      _id: "$eyeColor", //Group based on eyeColor field. Groups all documents into 3 drocument namely green, blue and brown
      count: {
        $sum: 1,
      },
    },
  },
];

// Q7 Average no. of tags user have

//Pipeline Stages: 1. $unwind 2. $group 3. $group
// Output:

// {
//     "_id": null,
//     "Average": 3.556
//   }

//Unwind eg.:
//
// [{
//     id: 1,
//     tags: [
//         "a",
//         "b"
//     ]
// }]
// after unwind it will become:
// [{
//     id:1,
//     tags:"a"
// },
// {
//     id:1,
//     tags:"b"
// }],

[
  {
    $unwind: "$tags", //create duplicate document with same id but different values of tags object
  },
  {
    $group: {
      _id: "$_id", //group based on id after unwind (will contain documents with duplicate ids and different $tag value therefore helping in counting no. of tags a user with same id has)
      tags: {
        $sum: 1, //count no. of tags for each document with same id
      },
    },
  },
  {
    $group: {
      _id: null, //group all documents after processing above pipeline stages into one document
      Average: {
        $avg: "$tags", //average no. of tags users have according to that one whole document
      },
    },
  },
];

// Q8 Average no. of tags user have
//Pipeline Stages: 1. $addFields 2.$group

// Output:

// {
//   "_id": null,
//   "averageTags": 3.556
// }

[
  {
    $addFields: {
      // create new fields named 'totalTags'
      totalTags: {
        $size: {
          // value of 'totalTags' contains size of tags array,
          $ifNull: ["$tags", []], // if "$tags" array doesn't exist(null) take it as empty array
        },
      },
    },
  },

  {
    $group: {
      _id: null,
      averageTags: {
        //pass addFields result to $group stage and then calculate $avg of $totalTags field created by addFields stage
        $avg: "$totalTags",
      },
    },
  },
],

  // Q8 Count the number of docs from previous pipeline stage
  //  using $count stage(not accumulator one)
  // Pipleine Stages: 1. $match 2. $count

  //output
  // {
  //   "totalDocs": 692
  // }
[
  ({
    $match: {
      age: {
        $gt: 25, //get the docs having $age field greater than 25
      },
    },
  },
  {
    $count: "totalDocs", //Count docs generated from $match stage and store them in totalDocs field
  })
],

  // Q9 max, min operators in group

  // $max returns maximum value for specified field of particular group. E.g  After grouping based on name. "Melanie Leon" document had maximum 4 tags which means other document with same name could have =<5 no. of tags
  //Oposite is true for $min

  //Output
  // {
  //   "_id": "Cooke Black",
  //   "maxTags": 5
  // }
  // {
  //   "_id": "Talley Palmer",
  //   "maxTags": 2
  // }
  // {
  //   "_id": "Melanie Leon",
  //   "maxTags": 4
  // }

  //Code
  [
    {
      $group: {
        _id: "$name",
        maxQuantity: {
          $max: { $size: "$tags" }, //$size operator for getting maximum size of array using $max group operator
        },
      },
    },
  ],

  //Q10 get first document for each group of ages
  //If documents are unordered then use sort before $first
  //$first returns null for missing field or value. If id is missing then id:null but value will be present. If value for which to find the doc is missing then null assigned to its value

  //E.g:
  // Docs
  { _id: 1, price: 6, quantity: 6 }, //missing item field(id in this case)
  { _id: 2, item: "album", price: 5, quantity: 5 },
  { _id: 8, price: 5, quantity: 5 }, ///missing item field(id in this case)
 
  // Code
  db.badData.aggregate([
    { $sort: { item: 1, price: 1 } }, //sort in acesding order(least to highest)
    {
      $group: {
        _id: "$item",
        inStock: { $first: "$quantity" },
      },
    },
  ])
  
  //Output
  [
    (
      { _id: null, inStock: 5 }, 
      { _id: "album", inStock: "" }
    )
  ],

  //BY ME:
  //Output

  // {
  //   "_id": 29,
  //   "firstDoc": "Celeste Armstrong"
  // }

  // {
  //   "firstDoc": "Tanya Doyle",
  //   "_id": 25
  // }

  // {
  //   "_id": 35,
  //   "firstDoc": "Lambert Todd"
  // }

  [
    {
      $group: {
        _id: "$age", //$group docs based on age
        firstDoc: {
          $first: "$name", //$first: get the first document for each age group(it really is the first doc on searching manually in db)
        },
      },
    },
  ],
  //Q11 Sort and find the first document(find last document too)

  //$last works in similar fashion. It returns last document of groups. (Can be used to find $lastSale for getting last sold document sorted by date in ascending order)

  //Output
  // Oldest document (registered:1)
  // {
  //   "_id": 29,
  //   "firstDoc": "Tammie Goodwin"

  // Newest document (registered:-1)
  // {
  //   "_id": 29,
  //   "firstDoc": "Noel Wilcox"
  // }
  // }

  [
    { $sort: { registered: -1 } }, //sort the data based on registered field which contains timestamp
    {
      $group: {
        _id: "$age",
        firstDoc: {
          $first: "$name",
        },
      },
    },
  ],
  //Orginals:

  // {name:"Tammie Goodwin",
  // isActive:false,
  // registered:2014-01-08T09:05:28.000+00:00, ...}

  // {name:"Noel Wilcox"
  // isActive:false
  // registered:2018-03-10T11:05:28.000+00:00, ...}

  //Q13 find favorite fruits of first five document in different age groups
  //$firstN group operator

  //Pipeline stages: 1. $sort 2. $group  3. $sort
  //Output

  // {
  //   "_id": 40, //Age 40
  //   "firstDoc": [
  //     "strawberry",
  //     "apple",
  //     "banana",
  //     "strawberry",
  //     "banana"
  //   ]
  // },

  // {
  //   "_id": 39, //Age 39
  //   "firstDoc": [
  //     "banana",
  //     "strawberry",
  //     "apple",
  //     "apple",
  //     "strawberry"
  //   ]
  // }
  // {
  //   "_id": 38,
  //   "firstDoc": [
  //     "strawberry",
  //     "apple",
  //     "apple",
  //     "banana",
  //     "apple"
  //   ]
  // }

  //Code
  [
    { $sort: { registered: -1 } }, //Sort by registered date in descending order(highest to lowest)(latest doc to oldest doc)
    {
      $group: {
        _id: "$age",
        firstDoc: {
          $firstN: {
            input: "$favoriteFruit", //find favorite fruits (input must be array, we get array of documents from $group by default)
            n: 5,
          }, //for first five documents arranged according to registered date for each age group
        },
      },
    },
    { $sort: { _id: -1 } }, // at last sort the output from oldest to youngest age group (pervious pipeline stage i.e $group returns documents in which age became _id therefore we need to sort according to _id instead of age this time)
    //This will arrange documents according to registered date in descending order then find favorite fruit for first five documents for each age group
    //It is not confusing just try, its just difficult to explain idk why
  ]
  
    // Q14 TopN
    // Conditional Operator
    // n: { $cond: { if: {$eq: ["$gameId","G2"] }, then: 1, else: 3 } }, calculate n value based on expression
    // If the documents coming into $group are already ordered, you should use $firstN.

    // If you're sorting and selecting the top n elements then you can use $topN to accomplish both tasks with one accumulator.

    // $firstN can be used as an aggregation expression, $topN cannot.
    // {
    //   "_id": "apple",
    //   "firstThreeElements": [
    //     [
    //       20,
    //       "Grace Larson"
    //     ],
    //     [
    //       20,
    //       "Combs Graham"
    //     ],
    //     [
    //       20,
    //       "Fay Trevino"
    //     ]
    //   ]
    // }
    // {
    //   "_id": "strawberry",
    //   "firstThreeElements": [
    //     [
    //       20,
    //       "Estella Mccarthy"
    //     ],
    //     [
    //       20,
    //       "Kimberly House"
    //     ],
    //     [
    //       20,
    //       "Howe Shields"
    //     ]
    //   ]
    // }
    // {
    //   "_id": "banana",
    //   "firstThreeElements": [
    //     [
    //       20,
    //       "Cobb Wells"
    //     ],
    //     [
    //       20,
    //       "Brennan Gillespie"
    //     ],
    //     [
    //       20,
    //       "Kelly Valencia"
    //     ]
    //   ]
    // }
    
    
    //code
  [
      {
      $group: {
        _id: "$favoriteFruit", //group based on $favoriteFruit hence three groups will be created
        firstThreeElements: {
          // used when need to sort before getting elements instead of firstN
          $topN: {
            output: ["$age", "$name"], //returns arrays each with 2 items. First contains $age and second contains $name of first three persons(you can get any element)
            sortBy: { age: 1 }, // sorts the documents according to age before getting first three documents for each group
            n: 3, //number of documents to get for each group
          },
        },
      },
    }
  ],
  
  //Q15 Arithemetic Operators
  //output
  // {
    //   "_id": "Marquez Mosley",
    //   "Summingup": 3627
    // }
  [
    ({
      $group: {
        _id: "$name",
        Summingup: {
          $sum: { $multiply: ["$age", "$index"] }, //$multiply the age and index of grouped items then sum together
        },
      },
    },
    {
      $match: {
        Summingup: { $lte: 20000 }, //less than or equal to 20000 value of summing up field
      },
    })
  ];

// Q16 use of datetostring
//Output
// {
//   "_id": "2014-12-18",
//   "username": [
//     "Mcgee Ratliff",
//     "Conrad Mendez"
//   ]
// }
// {
//   "_id": "2016-12-31",
//   "username": [
//     "Jones Hensley"
//   ]
// }
// {
//   "_id": "2014-09-10",
//   "username": [
//     "Phyllis Howe"
//   ]
// }
//Code
[
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$registered" } }, //group based on date in $registered field with given format
      username: { $push: "$name" },
    },
  },
];
// Q17 use of push operator
//Output
// {
//   "_id": "Ramsey Garner",
//   "username": [
//     "Ramsey Garner"
//   ]
// }
// {
//   "username": [
//     "Tanisha Houston"
//   ],
//   "_id": "Tanisha Houston"
// }
//Code
[
  {
    $group: {
      _id: "$name",
      username: { $push: "$name" },
    },
  },
],
  //  Q 18 $unset stage(remove multiple fields in every document)
  //Output
  // {
  //   "age": 32,
  //   "gender": "female",
  //   "eyeColor": "blue",
  //   "favoriteFruit": "banana",
  //   "company": {
  //     "title": "PARAGONIA",
  //     "phone": "+1 (875) 523-3825",
  //     "location": {
  //       "country": "USA",
  //       "address": "767 Hendrix Street"
  //     }
  //   },
  //   "name": "Mable Pratt",
  //   "registered": {
  //     "$date": "2016-04-22T11:00:05.000Z"
  //   }
  // }
  // {
  //   "gender": "male",
  //   "eyeColor": "green",
  //   "favoriteFruit": "strawberry",
  //   "company": {
  //     "title": "ISONUS",
  //     "phone": "+1 (871) 452-3036",
  //     "location": {
  //       "country": "Italy",
  //       "address": "586 Blake Court"
  //     }
  //   },
  //   "name": "Dale Holman",
  //   "registered": {
  //     "$date": "2014-07-11T09:08:36.000Z"
  //   },
  //   "age": 22
  // }
  [
    {
      $unset: [
        // Can specify single item in array to remove it
        "isActive",
        "index",
        "_id",
        "tags",
        "company.name", //embedded doc
        "company.email",
      ],
    },
  ];

// Q19 use of $set stage
//Output
// {
//   "_id": {
//     "$oid": "65ba0eddfefd67d44976e74e"
//   },
//   "age": 38,
//   "gender": "female",
//   "tags": [
//     "ut",
//     "voluptate",
//     "consequat",
//     "consequat",
//     "machine",// change with concatArray
//     "codelu" // change with concatArray
//   ],
//   "index": 1,
//   "name": "Kitty Snow",
//   "isActive": true, //changed
//   "registered": {
//     "$date": "2018-01-23T04:46:15.000Z"
//   },
//   "eyeColor": "blue",
//   "favoriteFruit": "peach", //changed
//   "company": {
//   "email": "kittysnow@digitalus.com",
//   "phone": "+1 (949) 568-3470",
//   "location": "ProgrammerDost",//was a embedded doc before
//   "title": "DIGITALUS"
// }
// }

//Code
[
  {
    $match: {
      index: 1,
    },
  },
  {
    $set: {
      isActive: true,
      "company.location": "ProgrammerDost",
      favoriteFruit: "peach",
      tags: { $concatArrays: ["$tags", ["machine", "codelu"]] }, // concatArrays first argument is array field, second is new array to concat. Everything wraps up in square brackets
    },
  },
];

// Q20 sortbyCount (sort and count the array items simultaneously)
//Output

// {
//   "_id": "dolor",
//   "count": 82
// }
// {
//   "_id": "ut",
//   "count": 68
// }
// {
//   "_id": "exercitation",
//   "count": 69
// }
// {
//   "_id": "culpa",
//   "count": 70
// }
// {
//   "_id": "sint",
//   "count": 69
// }

//Code

[
  {
    $unwind: {
      path: "$tags", //unwind the tags array
    },
  },
  {
    $sortByCount: "$tags", //count number of tags for same name and sort them accordingly(decending order)
  },
],


  // Q21 skip first five documents
  $skip //stage skipps the number of specified documents
    //Output

    // {

    // name: "Grace Larson"
    //   "eyeColor": "blue",
    //   "company": {
    //     "title": "OVOLO",
    //     "email": "gracelarson@ovolo.com",
    //     "phone": "+1 (930) 510-3310",
    //     "location": {}
    //   },
    //   "index": 5, ...
    // }

    // {
    //   "name": "Carmella Morse",
    //   "registered": {
    //     "$date": "2014-06-08T11:20:22.000Z"
    //   },
    //   "age": 39,
    //   "tags": [],
    //   "index": 6, ... }

    //Code
  [  
    ({
      $sort: {
        index: 1,
      },
    },
    {
      $skip: 5, //skip first 5 documents
    })
  ];


//Q22 Give discount of 30% if age is greater than 30 else 20

//using $cond operator which only works with $project stage
//Output:
// {
//   "Age": 20,
//   "discount": 20
// }
// {
//   "Age": 39,
//   "discount": 30
// }
// {
//   "Age": 40,
//   "discount": 30
// }
// {
//   "Age": 39,
//   "discount": 30
// }
// {
//   "Age": 22,
//   "discount": 20
// }

//Code
[
  {
    $sort: {
      index: 1, //sort by definite/consistent field index
    },
  },
  {
    $skip: 5, //skip first five docs after sorting(maybe because they got 70% discount as first customers)
  },
  {
    $project: {
      _id: 0, //no id field in output
      Age: "$age", //Age field for each doc
      discount: {
        $cond: { if: { $gte: ["$age", 30] }, then: 30, else: 20 }, //can be used without explicitily typing if,else,then
      },
    },
  },
],

//Q23 $ifNUll do something

//Code
[
  ({
    $unset: ["favoriteFruit", "company.title"], //removes favoriteFruit and company.title from all the documents
  },
  {
    $project: {
      _id: 0,
      Age: "$age",
      descr: { $ifNull: ["$favoriteFruit", "$company.title", "NA"] },
    },
  })
],

//output
// {
  //   "Age": 32,
  //   "descr": "NA"
  // }
  // {
    //   "Age": 22,
    //   "descr": "NA"
    // }
    
    //Code without removing company.title
[
  ({
    $unset: ["favoriteFruit"], //removes favoriteFruit from all the documents
  },
  {
    $project: {
      _id: 0,
      Age: "$age",
      descr: {
        $ifNull: ["$favoriteFruit", "$company.title", "NA"], //if $favoriteFruit is null then show $company.title if both of them are null then show "NA"
      },
    },
  })
],
// output
  {
    "Age": 40,
    "descr": "ENDIPIN"
  },
  {
      "Age": 32,
      "descr": "PARAGONIA"
  },
  {
        "Age": 22,
        "descr": "ISONUS"
  },
      
  

//Q24 check if field is array or not
//$isArray
      
//Code
[
  ({
    $unset: ["favoriteFruit", "tags"],
  },
  {
    $project: {
      _id: 0,
      Age: "$age",
      descr: {
        $ifNull: [
          "$favoriteFruit",
          {
            $cond: {
              if: { $isArray: "$tags" },
              then: "$tags",
              else: "NotArray",
            },
          },
        ],
      },
    },
  })
],

//output

{
    "Age": 32,
    "descr": "NotArray"
},
{
    "Age": 22,
    "descr": "NotArray"
},
    
    //Code
[
  ({
    $unset: ["favoriteFruit"],
  },
  {
    $project: {
      _id: 0,
      Age: "$age",
      descr: {
        $ifNull: [
          "$favoriteFruit",
          {
            $cond: {
              if: { $isArray: "$tags" },
              then: "$tags",
              else: "NotArray",
            },
          },
        ], //$isArray returns true or false
      },
    },
  })
],
  //output
  {
    Age: 22,
    descr: ["tempor", "aliqua", "duis"],
  },
 
  
  //Q25 Check if "tempor" is present in the $tags
  // $in

  //Code
  [
    ({
      $unset: ["favoriteFruit"],
    },
    {
      $project: {
        _id: 0,
        Age: "$age",
        tagPresent: {
          $in: ["tempor", "$tags"], //return true if 'tempor' is present in $tags array
        },
        descr: {
          $ifNull: [
            "$favoriteFruit",
            {
              $cond: {
                if: { $isArray: "$tags" },
                then: "$tags",
                else: "NotArray",
              },
            },
          ],
        },
      },
    })
  ],

  //output:
  {
    Age: 22,
    tagPresent: true,
    descr: ["tempor", "aliqua", "duis"],
  },
  {
    Age: 36,
    tagPresent: false,
    descr: ["cillum", "sint"],
  }
  
  
  //Q26 Add "hello taggy" to each $tags array element
  // $map aggregation operator
  
  //Code
  [
    {
      $project: {
        _id: 0,
        // Age: "$age",
        tagPresent: {
          $map: {
            input: "$tags", //specify array field
            as: "tag", //specify name of each array element for iteration(default is $$this )
            in: {
              //use specified element name using $$tag(define expression to process on each element)
              tagIs: { $concat: ["$$tag", "-", "hello tagy"] }, //concatenate tag name, - and 'hello tagy' for each element and store each element in tagIs
            },
          },
        },
      },
    }
  ],
  //Output:
  {
    tagPresent: [
      {
        tagIs: "tempor-hello tagy",
      },
      {
        tagIs: "aliqua-hello tagy",
      },
      {
        tagIs: "duis-hello tagy",
      },
    ],
  },
  {
    tagPresent: [
      {
        tagIs: "cillum-hello tagy",
      },
      {
        tagIs: "sint-hello tagy",
      },
    ],
  },
  
  
  //Q27 Filter the docs which contains "tempor", "sint" in tags array
  // output
  {
    Tags: ["tempor", "aliqua", "duis"],
    tagPresent: [
      "tempor", //tempor present
    ],
  },
  {
    Tags: [
      "consequat",
      "sint", //sint present
    ],
    tagPresent: ["sint"],
  },
  {
    Tags: ["duis", "nisi", "veniam", "amet", "enim"],
    tagPresent: [], //neither "tempor" nor "sint" are present
  },
  
  //code
  [
    {
      $project: {
        _id: 0,
        Tags: "$tags", //each document will go inside the tagPresent below and hence in filter aggression operator
        tagPresent: {
          $filter: {
            //filter operators
            input: "$tags", //input takes array expression to filter data in
            as: "tag", //name of var for denoting each array element in iteration
            cond: {
              // condition for each element to filter element based on true or false
              $or: [
                // logical operator
                { $eq: ["tempor", "$$tag"] }, // check if "tempor" is equal to current document's "$tags" array element on iteration over the it
                { $eq: ["sint", "$$tag"] }, //similarly check if any array's element of current document is equal to "sint"
              ],
            },
          },
        },
      },
    }
  ],
  
  //Q28 $match
  
  //You can't use every operator with $match just use only those which involves document selection, querying and filtering
  //Operators like $add don't work because they don't store anything, although you can use a equate operator to find if sum of something is present in any field of the document or in similar fashion.
  
  //Code
  
  [
    {
      $match: {
        $expr: { $eq: [{ $add: ["$age", 20] }, 40] }, //add 20 to age and see if it equals to 40. If true match only those documents
      },
    }
  ],

  //output-returns each doc with 20 as age

  {
    _id: {
      $oid: "65ba0eddfefd67d44976e782",
    },
    index: 53,
    name: "Cobb Wells",
    isActive: true,
    gender: "male",
    age: 20,
  },
  
  
  
  //Date- 05.02.2024
  
  //Q29 Find name for active users which contains "velit" tag
  //Output
  {
    tags: ["consequat", "velit", "aliquip"],
    isActive: true,
  },
  {
    isActive: true,
    tags: ["adipisicing", "ipsum", "amet", "velit", "nulla"],
  }
  
  //Code
  [
    ({
      $match: {
        isActive: true,
        tags: "velit",
        $expr: { age: { $gt: ["$age", 20] } },
      },
    },
    {
      $project: {
        _id: 0,
        isActive: 1,
        tags: 1,
      },
    })
  ],


  //Q30 If company's location is "694 Hewes Street" then remove the location field
  //Use $$REMOVE in $project. $unset can also be used to remove fields from all docs at once like we have _id:0 in project stage
  //output
  {
    index: 0, //location field got deleted
  },
  {
    index: 1,
    companyName: {
      country: "Italy",
      address: "154 Arlington Avenue",
    },
  },
  {
    index: 2,
    companyName: {
      country: "France",
      address: "795 Borinquen Pl",
    },
  },

  //Code
  [
    {
      $sort: {
        index: 1, //sort acc. to index field
      },
    },

    {
      $project: {
        _id: 0, //remove id from projection
        index: 1, //show index
        companyName: {
          //new field
          $cond: {
            if: { $eq: ["694 Hewes Street", "$company.location.address"] }, //if address doc contains 694 Hewes Street
            then: "$$REMOVE", //then remove the companyName field
            else: "$company.location", //else show the companyName field
          },
        },
      },
    },
  ],
  //Project can't index array(arr.1 ❌) //Project can be used to add various fields to new object or array.  E.g=> myArray: [ "$x", "$y" ]


  //Q31 //Lookup- join one collection to another

  //Output
  {
    _id: 1,
    title: "The Great Gatsby",
    author_id: 100,
    genre: "Classic",
    author_details: [
      {
        name: "F. Scott Fitzgerald",
        birth_year: 1896,
        _id: 100,
      },
    ],
  },
  {
    _id: 2,
    title: "Nineteen Eighty-Four",
    author_id: 101,
    genre: "Dystopian",
    author_details: [
      {
        _id: 101,
        name: "George Orwell",
        birth_year: 1903,
      },
    ],
  },
  {
    _id: 3,
    title: "To Kill a Mockingbird",
    author_id: 102,
    genre: "Classic",
    author_details: [
      {
        name: "Harper Lee",
        birth_year: 1926,
        _id: 102,
      },
    ],
  },
  
  //Code-working from books collection
  [
    {
      $lookup: {
        from: "authors", //foreign collection
        localField: "author_id", //local field which is in relation with the author collection
        foreignField: "_id", //foreign field which local collection relates to present in the author collection
        as: "author_details", //output field name
      },
    },
  ],


  //Q32 //Working with array=>
  //Output
  {
    _id: {
      $oid: "65c05cf19a6c3bfcb7d2c019",
    },
    arr: ["George Orwell", "Harper Lee"],
    author_details: [
      //because arr contains both the authors
      {
        _id: 102,
        name: "Harper Lee",
        birth_year: 1926,
      },
      {
        _id: 101,
        name: "George Orwell",
        birth_year: 1903,
      },
    ],
  },
  {
    _id: {
      $oid: "65c092ab384e6348dec5b63a",
    },
    arr: [
      "George Orwell", //second arr contains only one arr
    ],
    author_details: [
      {
        _id: 101,
        name: "George Orwell", //therefore only one document returned
        birth_year: 1903,
      },
    ],
  },

  //Code
  [
    {
      $lookup: {
        from: "authors",
        localField: "arr", //array field which  contains element that are in relation with the foreign field i.e ["George Orwell", "Harper Lee"]
        foreignField: "name", // name of the foreign field has relation with local field i.e {id:0, name: "Harper Lee"}, {id:1, name: "George Orwell"}
        as: "author_details",
      },
    }
  ],
  
  
  //Q33//Merge both collection's document into one
  //Output
  {
    name: "Harper Lee",
    birth_year: 1926,
    arr: ["George Orwell", "Harper Lee"],
  },
  {
    arr: ["George Orwell"],
    name: "George Orwell",
    birth_year: 1903,
  }
  
  //Code
  [
    ({
      $lookup: {
        from: "authors",
        localField: "arr",
        foreignField: "name",
        as: "author_details",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$author_details", 0] }, "$$ROOT"],
        },
      }, //add author_details we get from lookup to root document and then hide author_details
    },
    { $project: { author_details: 0, _id: 0 } }) //hide author_details because we now have author embedded/merged in root
  ]
  
  //Q34 Use of 'pipeline in lookup'
  // its basically used for having more complex querying inside lookup and modifying result by using the aggregation stages inside it
  // on using lookup you have both collection's data and pipeline allows you to do various operations on this data
  
  //code
  [
    {
      $lookup: {
        from: "authors", //from collection
        let: { user: "$username" }, //local field name to use in pipeline
        pipeline: [
          // pipeline begins
          {
            // match document in which "user" field of users collection is equal to "name"  field of author collection
            $match: {
              $expr: {
                //use of expr in match is good choice instead of directly writing expressions
                $and: [
                  //match only if both expressions are true
                  { $eq: ["$$user", "$name"] }, // $name field is from authors collection while $$user is one we defined in let i.e local field
                  { $gte: ["$birth_year", 1900] }, //$birth_year from author collection. Just for use case I added these fields because I didnt had that much data.  The result itself doesn't make any sense but its only for a example how to use pipeline.
                ],
              },
            },
          },
          { $project: { _id: 0 } }, // hide id field from result of this pipeline
        ],
        as: "AuthorData", // output field name
      },
    }
  ],
  
  //Q35 regex example
  //output
  {
    "Total Doc": 5,
  },
  
  //Code
  [
    {
      $match: {
        "company.phone": /^\+1 \(940\)/,
      },
    },
    { $count: "Total Doc" },
  ],
  
  
  //Q36 Categorise user based on favoriteFruit and find Total users for each Fruit
  //output
  {
    TotalUsers: 339,
    fruitName: "banana",
  },
  {
    fruitName: "apple",
    TotalUsers: 338,
  },
  {
    fruitName: "strawberry",
    TotalUsers: 323,
  },
  
  //Code
  [
    {
      $group: {
        _id: "$favoriteFruit",
        user: {
          $push: "$name", //push value to users array
        }, //categorised users according to favorite fruite at this point
        count: {
          //count no. of users for each fruit
          $sum: 1,
        },
      },
    },
    {
      $project: {
        fruitName: "$_id",
        _id: 0,
        TotalUsers: "$count", //change var name and hide _id
      },
    },
    {
      $sort: {
        count: -1, //sort in descending order
      },
    },
  ],
  
  //Q37 Find total no. of users having "ad" as their second tag
  //output
  {
    totalUser: 12,
  }
  
  //Code
  
  [
    ({
      $match: {
        "tags.1": "ad",
      },
    },
    {
      $count: "totalUsers",
    })
  ],
  
  //Q38 Find users having both "enim" and "id" as their tags
  //Output
  {
    _id: {
      $oid: "65ba0eddfefd67d44976e74d",
    },
    name: "Aurelia Gonzales",
    tags: [
      "enim", //tag 1
      "id", //tag 2
      "velit",
      "ad",
      "consequat",
    ],
  },
  {
    _id: {
      $oid: "65ba0eddfefd67d44976e8a9",
    },
    name: "Mcgowan Rosales",
    tags: [
      "enim", // tag 1
      "duis",
      "id", //tag 2
      "exercitation",
    ],
  },
  //Code
  [
    {
      $match: {
        $expr: {
          $and: [
            //only match if both are true
            { $in: ["enim", "$tags"] }, //check if "enim" is in $tags array
            { $in: ["id", "$tags"] },
          ],
        },
      },
    },
    ,
    {
      $project: {
        name: 1,
        tags: 1,
      },
    },
  ]
  
  //use of $all operator (Another efficient approach)
  
  //code
  [
    {
      $match: {
        tags: {
          //array field specified
          $all: ["enim", "id"], //find all given values in $tags array only then  match that document
        },
      },
    }
  ], //give same output as above


  //Q39 Get all companies with location in USA with their corresponding user count
  //output
  {
    _id: "BLEEKO",
    userCount: 1,
  },
  {
    _id: "TELLIFLY",
    userCount: 1,
  },
  {
    _id: "MANGELICA",
    userCount: 1,
  }
  
  //Code
  [
    ({
      $match: {
        "company.location.country": "USA",
      },
    },
    {
      $group: {
        _id: "$company.title",
        userCount: {
          $sum: 1,
        },
      },
    })
  ],


  // Q40 Another way to do lookup
  //move object outside of array

  //output
  {
    _id: 3,
    title: "To Kill a Mockingbird",
    author_id: 102,
    genre: "Classic",
    authorDetails: {
      _id: 102,
      name: "Harper Lee",
      birth_year: 1926,
    },
  },
  {
    author_id: 100,
    genre: "Classic",
    authorDetails: {
      _id: 100,
      name: "F. Scott Fitzgerald",
      birth_year: 1896,
    },
    _id: 1,
    title: "The Great Gatsby",
  }
    //Code
    [
      ({
      $lookup: {
        from: "authors", //foreign collection
        localField: "author_id", //local field which is in relation with the author collection
        foreignField: "_id", //foreign field which has relation with the local collection(field present in authors collection)
        as: "author_details", //output field name
      },
    },
    {
      $addFields: {
        authorDetails: {
          $first: "$author_details", //by this you can get first object instead of object inside the array.
        }, //Can also use firstN for getting N no. of objects but again it'll be in array. Therefore, if you need to get more than one object, then, iterating the array is the option.
      },
    },
    {
      $unset: "author_details",
    })
  ];
