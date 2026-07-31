import { Link } from "react-router-dom";

function About() {
  return (
    <div>
      <h1 className="sound-title">About</h1>
      <div className="about-text">
        <p>
          Noisy is my personal project. It is meant to be used for sleep, relaxation, or any other kind of activity that can benefit from some ambient noise. So far, it features some basic noise, as well as some generative compositions and nature recording blends.
        </p>
        <p>
          Anyone interested in contributing algorithmic or recorded audio to this website, please reach out on GitHub. This project is open-source. All the audio and animations used are created by myself, with the exception of recordings in the ambience section, which are from Freesound and BBC nature.
        </p>
        <div className="about-links">
          <a href="https://github.com/Szym03/NOISY" target="_blank" rel="noopener noreferrer" className="sound-link">
            github repo
          </a>
          <a href="https://walendowski.net" target="_blank" rel="noopener noreferrer" className="sound-link">
            more about me
          </a>
        </div>
      </div>
      <Link to="/" className="back-link">Back to home</Link>
    </div>
  );
}

export default About;
