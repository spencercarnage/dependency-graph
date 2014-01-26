module.exports = [
  { name: 'foo', },
  { name: 'bar', kids: [
      { name: 'berry' }, 
      { name: 'bonnie', kids: [ { name: 'timmy', }, { name: 'sally' } ] },
      { name: 'billy' }
    ]
  },
  { name: 'baz', kids: [ { name:'bazzy' }, ], }
];
