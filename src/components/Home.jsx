import React from 'react';
import '../App.css';
import '../index.css'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import img1 from '../assets/img_1_philly.jpg';
import img2 from '../assets/img_2_philly.jpg';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <section
        className="hero"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="overlay">
          <h1>IsoPhilly</h1>
          <div className="small-bar" />
          <p>
            Predicting Philadelphia Real-Estate Values through Aggregating Indicators on an
            Isochrome Level
          </p>
          <Button
            variant="dark"
            onClick={() => navigate('/dashboard')}
            className="mt-3"
          >
            Explore the Dashboard
          </Button>
        </div>
      </section>

      <section
        className="hero"
        style={{ backgroundImage: `url(${img2})` }}
      >
        <div className="overlay">
          <p>
            While other tools calculate real estate value with aggregators on a 
            rigid census block scale, IsoPhilly uses isochromes, regions that
            mark how far a person can travel in a specified amount of time. This
            allows IsoPhilly to get a much more accurate representation of
            accessibility of features when compared to a traditional fixed region
            based approach.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
