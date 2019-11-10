'use strict';

var request = require('request');

//function to determine jobs in a given category and country

function query(jobt,jobl, callback)

{
  request({ "uri": "https://nn3dsuzdmbbb7ms-standardatp.adb.uk-london-1.oraclecloudapps.com/ords/labanish/recruitement/vacancies/"+jobt+"/"+jobl,
      "method": "GET"
    }, function (err, res1, body) {
        body = JSON.parse(body);
        callback(body, err);
  });

}


module.exports = {

  metadata: () => ({
    name: 'vacancies',
    properties: {
      jobType: { required: true, type: 'string' },
      jobLoc : { required: true, type: 'string' }
    },
    supportedActions: []
  }),
  invoke: (conversation, done) => {
    
    const { jobType } = conversation.properties();
    const { jobLoc } = conversation.properties();
    // determine jobs
    var jobLocUpper = jobLoc.toUpperCase();

console.log(jobType+ " "+jobLocUpper);

 query(jobType,jobLocUpper, function (res1, err){

  var lst = "";
  if (res1 && res1.items)
  {
    if (res1.items.length) 
    {
      for (var i = 0; i < res1.items.length; i++) 
      {
       
        if (i > 0)

          lst += ", "
        lst += res1.items[i].vacancyid +": "+res1.items[i].title;
       
      }
 //console.log(lst);

    conversation.variable("jobTypes", lst);
    conversation.transition();
    done();
    }
    else
    {
      console.log("No items on the selected category");
      conversation.reply("Unfortunately we do not have any vacancies related to " +jobType.toLowerCase() + " in "+jobLoc);
      conversation.transition();
      done();
    }
  }
  else
  {
    console.log("Encountered an error... please try again later or contact the demo administrator");
    conversation.reply("Encountered an error... please try again later or contact the demo administrator");
    conversation.transition();
    done();
  }
});

  }
};
