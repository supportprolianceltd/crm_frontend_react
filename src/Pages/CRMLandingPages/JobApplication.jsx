import usePageTitle from '../../hooks/usecrmPageTitle';
import { useState } from 'react';
import { ShareIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

function JobApplication() {
  usePageTitle('Frontend Website Developer - Proliance Ltd');
  const [selected, setSelected] = useState([]);

  return (
    <div className="ool-Apply-Seco">
      <header className="ool-Apply-Seco-header">
        <div className="large-container">
          <div className="ouoau-Hero">
            <h2>Frontend Website Developer</h2>
            <ul>
              <li>Full-time</li>
              <li>Remote</li>
              <li>$120 Monthly</li>
            </ul>
          </div>
          <div className="aoik-fffot">
            <div className="aoik-fffot-1">
              <div className="aoik-fffot-10">
                <h3>PR</h3>
              </div>
              <div className="aoik-fffot-11">
                <div>
                  <p>Proliance Ltd</p>
                  <span>Posted on: 6-12-2025</span>
                </div>
              </div>
            </div>
            <div className="aoik-fffot-2">
              <button><ShareIcon className="h-5 w-5 inline-block mr-1" /> Share job</button>
              <a href="https://prolianceltd.com" target="_blank" rel="noopener noreferrer">
                <GlobeAltIcon className="h-5 w-5 inline-block mr-1" /> Company site
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="gtht-secs">
        <div className="large-container">
          <div className="gtht-secs-Main">
            <div className="gtht-secs-Part1">
          

              <div className="gtht-secs-IIjah-Box">
                <h3>Job Description</h3>
                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <p>
                    We are looking for a passionate Frontend Website Developer to join our remote team.
                    You will be responsible for building and maintaining responsive, user-friendly web interfaces
                    using modern frontend technologies.
                  </p>
                </div>
              </div>

              <div className="gtht-secs-IIjah-Box">
                <h3>Key Responsibilities</h3>
                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <ul>
                    <li>Develop and maintain user interfaces using React.js</li>
                    <li>Translate UI/UX designs into functional code</li>
                    <li>Ensure cross-browser and cross-device compatibility</li>
                    <li>Collaborate with designers and backend developers</li>
                    <li>Write clean, efficient, and maintainable code</li>
                    <li>Optimize applications for speed and scalability</li>
                    <li>Participate in code reviews and agile development processes</li>
                  </ul>
                </div>
              </div>

                  <div className="gtht-secs-IIjah-Box">
                <h3>Basic Job Information</h3>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Job Title</h4>
                  <p>Frontend Website Developer</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Company Name</h4>
                  <p>Proliance Ltd</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Job Type</h4>
                  <p>Full-time</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Location</h4>
                  <p>Remote</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Company Address</h4>
                  <p>Lagos, Nigeria</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Salary Range</h4>
                  <p>$120 Monthly</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Qualification Requirement</h4>
                  <p>Bachelor’s degree in Computer Science or related field (optional but preferred)</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Experience Requirement</h4>
                  <p>1–2 years experience in frontend development</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Knowledge/Skill Requirement</h4>
                  <p>Proficient in HTML, CSS, JavaScript, React.js; familiar with Git and responsive design</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Deadline for Applications</h4>
                  <p>20-06-2025</p>
                </div>

                <div className="gtht-secs-IIjah-Box-Ddfa">
                  <h4>Start Date</h4>
                  <p>01-07-2025</p>
                </div>
              </div>
              
            </div>
            <div className="gtht-secs-Part2">
              {/* Optional: Add application form, contact card, or CTA */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default JobApplication;
