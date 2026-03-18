CREATE TABLE MeetingType (
    MeetingTypeID INT AUTO_INCREMENT PRIMARY KEY,
    MeetingTypeName VARCHAR(100) NOT NULL,
    Remarks VARCHAR(255),
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Meetings (
    MeetingID INT AUTO_INCREMENT PRIMARY KEY,
    MeetingDate DATETIME NOT NULL,
    MeetingTypeID INT NOT NULL,
    MeetingDescription VARCHAR(255),
    DocumentPath VARCHAR(255),
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    IsCancelled BOOLEAN DEFAULT FALSE,
    CancellationDateTime DATETIME,
    CancellationReason VARCHAR(255),

    CONSTRAINT fk_meeting_type
        FOREIGN KEY (MeetingTypeID)
        REFERENCES MeetingType(MeetingTypeID)
);

CREATE TABLE Staff (
    StaffID INT AUTO_INCREMENT PRIMARY KEY,
    StaffName VARCHAR(100) NOT NULL,
    MobileNo VARCHAR(15),
    EmailAddress VARCHAR(100),
    Remarks VARCHAR(255),
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE MeetingMember (
    MeetingMemberID INT AUTO_INCREMENT PRIMARY KEY,
    MeetingID INT NOT NULL,
    StaffID INT NOT NULL,
    IsPresent BOOLEAN DEFAULT FALSE,
    Remarks VARCHAR(255),
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_meeting
        FOREIGN KEY (MeetingID)
        REFERENCES Meetings(MeetingID),

    CONSTRAINT fk_staff
        FOREIGN KEY (StaffID)
        REFERENCES Staff(StaffID)
);


INSERT INTO MeetingType (MeetingTypeName, Remarks) VALUES
('Board Meeting', 'Annual board-level discussion'),
('Client Meeting', 'Meeting with external clients'),
('Team Meeting', 'Internal team discussion'),
('Project Kickoff', 'Initial project planning meeting'),
('Review Meeting', 'Progress and performance review'),
('Sales Meeting', 'Sales strategy and targets'),
('Training Session', 'Employee training and skill development'),
('HR Meeting', 'Human resource related discussion'),
('Budget Meeting', 'Financial planning and budgeting'),
('Status Update', 'Weekly or daily status update'),
('Strategy Meeting', 'Long-term planning discussion'),
('Vendor Meeting', 'Meeting with vendors or suppliers'),
('Audit Meeting', 'Internal or external audit discussion'),
('Demo Meeting', 'Product or service demonstration'),
('Scrum Meeting', 'Agile daily scrum meeting'),
('One-on-One', 'Individual performance discussion'),
('Town Hall', 'Organization-wide meeting'),
('Crisis Meeting', 'Urgent issue resolution'),
('Planning Meeting', 'Future task planning'),
('Retrospective Meeting', 'Post-project evaluation');

INSERT INTO Meetings 
(MeetingDate, MeetingTypeID, MeetingDescription, DocumentPath, IsCancelled, CancellationDateTime, CancellationReason)
VALUES
('2025-01-05 10:00:00', 1, 'Annual board discussion', '/docs/board_meeting.pdf', FALSE, NULL, NULL),
('2025-01-06 11:30:00', 2, 'Client requirement discussion', '/docs/client_meeting.pdf', FALSE, NULL, NULL),
('2025-01-07 09:30:00', 3, 'Weekly team sync', NULL, FALSE, NULL, NULL),
('2025-01-08 14:00:00', 4, 'New project kickoff', '/docs/project_kickoff.pdf', FALSE, NULL, NULL),
('2025-01-09 16:00:00', 5, 'Monthly review meeting', NULL, FALSE, NULL, NULL),
('2025-01-10 10:30:00', 6, 'Sales target planning', '/docs/sales_meeting.pdf', FALSE, NULL, NULL),
('2025-01-11 13:00:00', 7, 'Technical training session', NULL, FALSE, NULL, NULL),
('2025-01-12 15:30:00', 8, 'HR policy discussion', '/docs/hr_meeting.pdf', FALSE, NULL, NULL),
('2025-01-13 11:00:00', 9, 'Annual budget planning', NULL, FALSE, NULL, NULL),
('2025-01-14 09:00:00', 10, 'Daily status update', NULL, FALSE, NULL, NULL),

('2025-01-15 17:00:00', 11, 'Company growth strategy', '/docs/strategy_meeting.pdf', FALSE, NULL, NULL),
('2025-01-16 12:00:00', 12, 'Vendor contract discussion', NULL, FALSE, NULL, NULL),
('2025-01-17 10:00:00', 13, 'Internal audit meeting', '/docs/audit_meeting.pdf', FALSE, NULL, NULL),
('2025-01-18 14:30:00', 14, 'Product demo for client', NULL, FALSE, NULL, NULL),
('2025-01-19 09:30:00', 15, 'Daily scrum meeting', NULL, FALSE, NULL, NULL),
('2025-01-20 11:00:00', 16, 'One-on-one performance review', NULL, FALSE, NULL, NULL),
('2025-01-21 16:00:00', 17, 'Organization town hall', '/docs/townhall.pdf', FALSE, NULL, NULL),
('2025-01-22 13:30:00', 18, 'Urgent issue resolution', NULL, TRUE, '2025-01-22 12:00:00', 'Key members unavailable'),
('2025-01-23 10:30:00', 19, 'Quarterly planning meeting', NULL, FALSE, NULL, NULL),
('2025-01-24 15:00:00', 20, 'Project retrospective meeting', '/docs/retrospective.pdf', FALSE, NULL, NULL);




INSERT INTO Staff (StaffName, MobileNo, EmailAddress, Remarks) VALUES
('Amit Patel', '9876543210', 'amit.patel@company.com', 'Senior Manager'),
('Neha Sharma', '9823456781', 'neha.sharma@company.com', 'HR Executive'),
('Rohit Mehta', '9898765432', 'rohit.mehta@company.com', 'Sales Lead'),
('Pooja Verma', '9812345678', 'pooja.verma@company.com', 'Finance Officer'),
('Karan Shah', '9900123456', 'karan.shah@company.com', 'Project Manager'),
('Sneha Iyer', '9798123456', 'sneha.iyer@company.com', 'Software Engineer'),
('Vikas Gupta', '9887766554', 'vikas.gupta@company.com', 'Operations Head'),
('Anjali Desai', '9870011223', 'anjali.desai@company.com', 'Admin Executive'),
('Rahul Khanna', '9866554433', 'rahul.khanna@company.com', 'Business Analyst'),
('Priya Nair', '9855443322', 'priya.nair@company.com', 'UI/UX Designer'),

('Suresh Yadav', '9844332211', 'suresh.yadav@company.com', 'Support Manager'),
('Kavita Joshi', '9833221100', 'kavita.joshi@company.com', 'Accounts Executive'),
('Manish Agarwal', '9822110099', 'manish.agarwal@company.com', 'QA Lead'),
('Rina Kulkarni', '9811009988', 'rina.kulkarni@company.com', 'Recruitment Specialist'),
('Deepak Singh', '9800998877', 'deepak.singh@company.com', 'System Administrator'),
('Nidhi Bansal', '9899887766', 'nidhi.bansal@company.com', 'Marketing Coordinator'),
('Arjun Malhotra', '9788776655', 'arjun.malhotra@company.com', 'Product Owner'),
('Meenal Choudhary', '9777665544', 'meenal.choudhary@company.com', 'Content Strategist'),
('Sanjay Rao', '9766554433', 'sanjay.rao@company.com', 'Logistics Supervisor'),
('Isha Kapoor', '9755443322', 'isha.kapoor@company.com', 'Legal Advisor');



INSERT INTO MeetingMember 
(MeetingID, StaffID, IsPresent, Remarks)
VALUES
(1, 1, TRUE, 'Attended full meeting'),
(1, 2, TRUE, 'Attended full meeting'),
(1, 3, FALSE, 'On leave'),

(2, 4, TRUE, 'Joined on time'),
(2, 5, TRUE, 'Presented client requirements'),
(2, 6, FALSE, 'Client call overlap'),

(3, 7, TRUE, 'Team lead present'),
(3, 8, TRUE, 'Shared weekly updates'),
(3, 9, TRUE, 'Handled action items'),

(4, 10, TRUE, 'Project overview given'),
(4, 11, FALSE, 'Out of station'),
(4, 12, TRUE, 'Technical discussion'),

(5, 13, TRUE, 'Reviewed sprint goals'),
(5, 14, TRUE, 'Provided QA inputs'),
(5, 15, FALSE, 'Network issue'),

(6, 16, TRUE, 'Sales performance review'),
(6, 17, TRUE, 'Strategy inputs shared'),
(6, 18, FALSE, 'Meeting cancelled'),

(7, 19, TRUE, 'Training completed'),
(7, 20, TRUE, 'Hands-on session attended'),

(8, 1, FALSE, 'HR meeting cancelled'),
(8, 2, FALSE, 'HR meeting cancelled'),

(9, 3, TRUE, 'Budget discussion'),
(9, 4, TRUE, 'Finance approval given'),

(10, 5, TRUE, 'Daily update shared'),
(10, 6, TRUE, 'Task status updated'),

(11, 7, TRUE, 'Strategic planning'),
(11, 8, TRUE, 'Market analysis shared'),

(12, 9, FALSE, 'Vendor rescheduled'),
(12, 10, FALSE, 'Vendor rescheduled'),

(13, 11, TRUE, 'Audit points discussed'),
(13, 12, TRUE, 'Compliance noted'),

(14, 13, TRUE, 'Product demo successful'),
(14, 14, TRUE, 'Client queries answered'),

(15, 15, TRUE, 'Daily scrum'),
(15, 16, TRUE, 'Blocked issues shared'),

(16, 17, TRUE, 'One-on-one feedback'),
(16, 18, TRUE, 'Performance discussion'),

(17, 19, TRUE, 'Town hall participation'),
(17, 20, TRUE, 'Employee engagement'),

(18, 1, FALSE, 'Meeting cancelled'),
(18, 2, FALSE, 'Meeting cancelled'),

(19, 3, TRUE, 'Roadmap planning'),
(19, 4, TRUE, 'Milestones finalized'),

(20, 5, TRUE, 'Retrospective insights'),
(20, 6, TRUE, 'Action items defined');




select * from MeetingType;
select * from Meetings;
select * from Staff;
select * from MeetingMember
