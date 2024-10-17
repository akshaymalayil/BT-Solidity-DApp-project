App = {
  web3Provider: null,
  contracts: {},

  bindEvents: function() {
      // This binds the "Adopt" button to the handleAdopt function
      $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  init: async function() {
      // Initialize web3 and contract, then bind events
      await App.initWeb3();
      await App.initContract();
      App.bindEvents();

      // Load pets data from JSON file and dynamically populate the pet cards
      $.getJSON('../pets.json', function(data) {
          var petsRow = $('#petsRow');
          var petTemplate = $('#petTemplate');

          for (let i = 0; i < data.length; i++) {
              petTemplate.find('.panel-title').text(data[i].name);
              petTemplate.find('img').attr('src', data[i].picture);
              petTemplate.find('.pet-breed').text(data[i].breed);
              petTemplate.find('.pet-age').text(data[i].age);
              petTemplate.find('.pet-location').text(data[i].location);
              petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

              petsRow.append(petTemplate.html());
          }
      });
  },

  initWeb3: async function() {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access if needed
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log("MetaMask account connected successfully.");
            } catch (error) {
                console.error("User denied account access to MetaMask.", error);
                alert("Please connect MetaMask to use this dApp.");
                return; // Stop execution if access is denied
            }
        } else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        } else {
            console.error('No web3 provider detected. Please install MetaMask!');
            alert('MetaMask is required to interact with this dApp. Please install MetaMask.');
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },



initContract: function() {
    $.getJSON('Adoption.json', function(data) {
        App.contracts.Adoption = TruffleContract(data);
        App.contracts.Adoption.setProvider(App.web3Provider);
        return App.markAdopted();  // Do not bind events here
    });

    // For user registration
    $.getJSON('UserRegistration.json', function(data) {
        App.contracts.UserRegistration = TruffleContract(data);
        App.contracts.UserRegistration.setProvider(App.web3Provider);
    });
},


markAdopted: function() {
    App.contracts.Adoption.deployed().then(function(instance) {
        return instance.getAdopters.call();
    }).then(function(adopters) {
        for (let i = 0; i < adopters.length; i++) {
            if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                console.log('Updating button for pet index:', i);
                $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
            }
        }
    }).catch(function(err) {
        console.error(err.message);
    });
},

handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            console.error(error);
            return;
        }

        var account = accounts[0];

        App.contracts.Adoption.deployed().then(function(instance) {
            return instance.adopt(petId, { from: account });
        }).then(function(result) {
            console.log('Adoption successful:', result);
            return App.markAdopted();
        }).catch(function(err) {
            console.error('Adoption error:', err.message);
        });
    });
},


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
