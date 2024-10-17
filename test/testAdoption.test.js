const Adoption = artifacts.require("Adoption");


contract("Adoption", (accounts) => {
    let adoption;
    let expectedAdopters;


    before(async () => {
        adoption = await Adoption.deployed();
    });


    describe("adopting a pet and retrieving account addresses", async () => {
        before("adopt a pet using account[0]", async () => {
            await adoption.adopt(8, {from: accounts[0]});
            expectedAdopters = accounts[0];
        });


        it("can fetch the address of an owner by pet id", async () => {
            const adopter = await adoption.adopters(8); // change `adopter` to `adopters`
            assert.equal(adopter, expectedAdopters, "The owner of the pet should be the first account.");
        });


        it("can fetch the collection of all pet owner addresses", async () => {
            const adopters = await adoption.getAdopters();
            assert.equal(adopters[8], expectedAdopters, "The owner of the adopted pet should be in the collection.");
        });
    });
});
