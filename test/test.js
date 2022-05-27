let mongoose = require("mongoose");
// let ReservationModel = require('../src/model/reservation');
import ReservationModel from '../src/model/reservation'

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');
const { Db } = require("mongodb");
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Reservation', () => {
    beforeEach( (done) => { //Before each test we empty the database
        ReservationModel.remove({}, (err) => { 
            done();           
         }); 
            
    });
/*
  * Test the /GET route
  */
  describe('/GET reservation', () => {
      it('it should GET all the reservation', (done) => {
        chai.request(server)
            .get('/api/v1/reservation')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
              done();
            });
      });
  });

});

/*
* Test the /POST route
*/
describe('/POST reservation', () => {
    it('it should POST a reservation request', (done) => {
        let booking = {
            email: "rakesh@abc.com",
            first_name: "Rakesh",
            last_name: "RP",
            no_of_guests: 3,
            check_in:"2022-11-29",
            check_out:"2022-11-30",
        }
      chai.request(server)
          .post('/api/v1/reservation')
          .send(booking)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('booking_id');
            done();
          });
    });

});


 /*
  * Test the /GET/:id route
  */
 describe('/GET/:id reservation', () => {
    it('it should GET a reservation by the given booking_id', (done) => {
        let booking = new ReservationModel({
            email: "rob@abc.com",
            first_name: "Robin",
            last_name: "RP",
            no_of_guests: 2,
            check_in:"2023-11-29",
            check_out:"2023-11-30",
        });
        booking.save((err, data) => {
        chai.request(server)
          .get('/api/v1/reservation/' + data._id)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data').property('_id').eql(res.body.data._id);
                done();
          });
        });
    });
});


/*
* Test the /DELETE/:id route
*/
describe('/DELETE/:id reservation', () => {
    it('it should Cancel a reservation given the id', (done) => {
        let booking = new ReservationModel({
            email: "rob@abc.com",
            first_name: "Robin",
            last_name: "RP",
            no_of_guests: 2,
            check_in:"2023-11-29",
            check_out:"2023-11-30",
        });
        booking.save((err, data) => {
            chai.request(server)
              .delete('/api/v1/reservation/' + data._id)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data').property('_id').eql(res.body.data._id);
                    done();
              });
            });
        });
});


 /*
  * Test the Booking date overlapping
  */
 describe('/POST/ overlapping reservation', () => {
    it('it should show an error message when multiple guests trying to book the suite for the same or overlapping dates', (done) => {
        let john_booking = new ReservationModel({
            email: "johndoe@abc.com",
            first_name: "John",
            last_name: "Doe",
            no_of_guests: 2,
            check_in:"2023-06-01",
            check_out:"2023-06-03",
        });
        let jane_booking = new ReservationModel({
            email: "janedoe@abc.com",
            first_name: "Jane",
            last_name: "Doe",
            no_of_guests: 2,
            check_in:"2023-06-02",
            check_out:"2023-06-05",
        });
        john_booking.save((err, data) => {
            chai.request(server)
            .post('/api/v1/reservation')
            .send(jane_booking)
            .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Sorry!! Reservation is not available for given dates.');
              done();
            });
        });
    });
});


/*
* Test the date difference between dates are more than 3 days
*/
describe('/POST reservation', () => {
    it('it should not POST the reservation request when the date difference between check_in date and check_out dates are more than 3 days', (done) => {
        let booking = {
            email: "rakesh@abc.com",
            first_name: "Rakesh",
            last_name: "RP",
            no_of_guests: 3,
            check_in:"2022-12-10",
            check_out:"2022-12-15",
        }
      chai.request(server)
          .post('/api/v1/reservation')
          .send(booking)
          .end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Sorry!! You can not reserve presidential suite for more than 3 days.');
            done();
          });
    });
});


/*
* Test the input for number of guests are more than 3
*/
describe('/POST reservation', () => {
    it('it should not POST the reservation request when the number of guests are more than 3', (done) => {
        let booking = {
            email: "sonam@abc.com",
            first_name: "Sonam",
            last_name: "Kapoor",
            no_of_guests: 4,
            check_in:"2024-12-10",
            check_out:"2024-12-11",
        }
      chai.request(server)
          .post('/api/v1/reservation')
          .send(booking)
          .end((err, res) => {
                console.log(res.body);
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('"no_of_guests" must be less than or equal to 3');
            done();
          });
    });
});
