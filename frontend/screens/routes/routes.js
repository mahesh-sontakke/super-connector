var app = Sammy('#main', function() {
    // include a plugin
  
    // define a 'route'
    this.get('#/tasks', function() {
        Tasks.init();
    });
    this.get('#/contacts', function() {
        Contacts.init();
    });
    this.get('#/crons', function() {
        Crons.init();
    });
  });
  
  // start the application
  app.run('#/');