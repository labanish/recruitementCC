'use strict';
//function to determine jobs in a given category
var request = require('request');
function query(job, callback)
{
  request({ "uri": "https://nn3dsuzdmbbb7ms-standardatp.adb.uk-london-1.oraclecloudapps.com/ords/labanish/recruitement/vacanciesInfo/"+job,
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
    },
    supportedActions: []
  }),
  invoke: (conversation, done) => {
    
    const { jobType } = conversation.properties();
    // determine jobs


    query(jobType, function (res1, err){

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
 console.log(lst);

    conversation.variable("jobTypes", lst);
    conversation.transition();
    done();
    }
  }
  else
  {
    //console.log("Encountered an error... please try again later or contact the demo administrator");
    conversation.reply("Encountered an error... please try again later or contact the demo administrator");
    conversation.transition();
    done();
  }
});

  }
};
