import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">&#128197;</span>
            <span className="logo-text">StudyCalendar</span>
          </div>
          <h1>Plan smarter.<br />Study better.</h1>
          <p className="tagline">
            StudyCalendar helps you schedule and track your study sessions throughout the week.
            Build your routine, stay on top of your subjects, and see your progress — all in one place.
          </p>
          <Link to="/login" className="btn">Get Started</Link>
          <h3>By Chloe Becker</h3>
        </div>
      </header>

      <section id="features" className="features">
        <div className="container">
          <h2>What you can do</h2>
          <ul className="feature-list">
            <li className="feature-card">
              <span className="feature-icon">&#128197;</span>
              <div>
                <h3>Weekly Calendar View</h3>
                <p>See all your study sessions laid out by day so you can spot gaps and plan ahead.</p>
              </div>
            </li>
            <li className="feature-card">
              <span className="feature-icon">&#9998;</span>
              <div>
                <h3>Add, Edit &amp; Delete Sessions</h3>
                <p>Create study blocks with a subject, start time, duration, and optional notes.</p>
              </div>
            </li>
            <li className="feature-card">
              <span className="feature-icon">&#127912;</span>
              <div>
                <h3>Subject Color Coding</h3>
                <p>Assign a color to each subject so you can tell them apart at a glance.</p>
              </div>
            </li>
            <li className="feature-card">
              <span className="feature-icon">&#9989;</span>
              <div>
                <h3>Session Completion Tracking</h3>
                <p>Check off finished sessions and watch your weekly completion percentage climb.</p>
              </div>
            </li>
            <li className="feature-card">
              <span className="feature-icon">&#128274;</span>
              <div>
                <h3>Secure Cloud Sync</h3>
                <p>Your schedule is saved to the cloud and tied to your account — access it from any device.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>StudyCalendar &mdash; Midterm Project &bull; Built with React, Firebase &amp; Firestore</p>
        </div>
      </footer>
    </>
  );
}
