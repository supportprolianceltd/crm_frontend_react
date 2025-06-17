import React, { useState } from 'react';
import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const jobList = [
  { id: 1, title: "Frontend Website Developer", posted: "5 days ago" },
  { id: 2, title: "Security Analyst", posted: "3 days ago" },
  { id: 3, title: "Mobile Developer", posted: "14 days ago" },
  { id: 4, title: "DevOps Engineer", posted: "20 days ago" },
  { id: 5, title: "Cloud Architect", posted: "33 days ago" },
  { id: 6, title: "Data Scientist", posted: "1 week ago" },
  { id: 7, title: "UI/UX Designer", posted: "2 weeks ago" },
  { id: 8, title: "Backend Developer", posted: "6 days ago" },
  { id: 9, title: "Cybersecurity Engineer", posted: "4 days ago" },
   { id: 10, title: "Project Manager", posted: "11 days ago" }
];

const applicants = [
  {
    id: 1,
    initials: 'PG',
    name: 'Prince Godson',
    schedule: '06 May 2025 - 7:35 AM'
  },
  {
    id: 2,
    initials: 'OD',
    name: 'Orji Daniel',
    schedule: '06 Jun 2025 - 5:35 PM'
  },
  {
    id: 3,
    initials: 'MJ',
    name: 'Mary Johnson',
    schedule: '15 Jul 2025 - 9:00 AM'
  },
  {
    id: 4,
    initials: 'AB',
    name: 'Ali Bello',
    schedule: '21 Jul 2025 - 11:00 AM'
  },
  {
    id: 5,
    initials: 'CN',
    name: 'Chinyere Nnaji',
    schedule: '30 Jul 2025 - 3:15 PM'
  },
  {
    id: 6,
    initials: 'KS',
    name: 'Kemi Shola',
    schedule: '05 Aug 2025 - 8:45 AM'
  },
  {
    id: 7,
    initials: 'ET',
    name: 'Emeka Tony',
    schedule: '10 Aug 2025 - 1:30 PM'
  },
  {
    id: 8,
    initials: 'FA',
    name: 'Fatima Abubakar',
    schedule: '12 Aug 2025 - 4:00 PM'
  }
];

const Schedule = () => {
  const [activeJobId, setActiveJobId] = useState(jobList[0].id);
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  const activeJob = jobList.find(job => job.id === activeJobId);

  const handleJobClick = (jobId) => {
    setActiveJobId(jobId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicantClick = (applicantId) => {
    setSelectedApplicants(prevSelected => {
      if (prevSelected.includes(applicantId)) {
        // Deselect
        return prevSelected.filter(id => id !== applicantId);
      } else {
        // Select
        return [...prevSelected, applicantId];
      }
    });
  };

  return (
    <div className='Schedule-PPao'>
      <div className='Schedule-PPao-main'>
        <div className='Schedule-PPao-1'>
          <div className='Schedule-PPao-1-Boxx'>
            <div className='Schedule-PPao-1-Boxx-Top'>
              <h3>Posted Jobs</h3>
            </div>
            <div className='Schedule-PPao-1-Boxx-Main Gen-Boxshadow custom-scroll-bar'>
              <ul>
                {jobList.map(job => (
                  <li
                    key={job.id}
                    className={activeJobId === job.id ? 'active-ggarg-Li' : ''}
                    onClick={() => handleJobClick(job.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3>{job.title}</h3>
                    <p>Posted {job.posted}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className='Schedule-PPao-2'>
          <div className='Schedule-PPao-2-header'>
            <h3>
              {activeJob.title} <span><b>Posted:</b> {activeJob.posted}</span>
            </h3>
            <p>Date: 6-16-2025</p>
          </div>

          <div className='OOl_AGtg_Sec'>
            <div className='OOl_AGtg_Sec_1'>
              <div className='Schedule-PPao-1-Boxx-Top ooo-Hyha'>
                <h3>
                  Shortlisted Applicants <span>{applicants.length} total</span>
                </h3>
              </div>

              <div className='OOl_AGtg_Sec_1_main'>
                <ul>
                  {applicants.map(applicant => (
                    <li
                      key={applicant.id}
                      className={selectedApplicants.includes(applicant.id) ? 'active-OLI-O' : ''}
                      onClick={() => handleApplicantClick(applicant.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className='LLia_DV'>
                        <div className='LLia_DV_1'>
                          <span>{applicant.initials}</span>
                        </div>
                        <div className='LLia_DV_2'>
                          <div>
                            <h3>{applicant.name}</h3>
                            <p><span>Schedule:</span> {applicant.schedule}</p>
                            <span className='clear-schedule-Data'>
                              <ArrowPathIcon />
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className='OOl_AGtg_Sec_2'>
                  <div className='Sheccuc-BosXX Gen-Boxshadow'>
                        <div className='Schedule-PPao-1-Boxx-Top ooo-Hyha'>
                        <h3>
                          Schedule Interview
                        </h3>
                      </div>

                      <div className='ppol-Btns'>
                        <div className='oii-DDDDV'>
                        <button>Schedule Calendar</button>
                        <p>Schedule for: <span>All</span></p>
                        </div>
                        <button>Time <ChevronDownIcon /></button>
                      </div>

                      <div className='PPOli_Sea'>
                        <div className='PPOli_Sea_Card'>
                          <div className='PPOli_Sea_Card_1'>
                            <span className='DDat-IADf'>AUG</span>
                            <span>24</span>
                          </div>
                          <div className='PPOli_Sea_Card_2'>
                            <div>
                              <h5>Tuesday, 24 2025</h5>
                              <h6>5:30 PM</h6>
                            </div>
                          </div>
                        </div>
                      </div>

                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
