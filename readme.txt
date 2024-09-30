About
========
File repository system has been developed as part of Mini-Project for Software Development Engineering.
File Repository System is common platform for uploading and downloading files freely.
It is developed in various architectural pattern compairing its performance in terms latency, scalability and Security.
Also, it is hosted and developed in EC2 machine in AWS cloud.

Services Offered
==================
1). Download
2). Upload
3). Search
4). Login
5). Registration

Requirement:
==============

Cloud Components
-----------------
EC2 instance - 6
Kubernetes
Load Balancer
S3-Bucket
PostGreSQL


Software and Libraries
-----------------------
Docker
fastapi[standard]
SQLAlchemy
passlib
python-jose
pydantic-settings
python-dotenv
psycopg2
bcrypt
python-multipart
boto3

How to install
===============
python3.12 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload


Implementation of various Architecture Pattern:
================================================
1).Microservices
   --------------
All the services are deployed in microservices with load balancer increasing the availablity of
each services horizontally scaling up to meet the requirement as per demand. Each of the Servies are independenlty
deployed in differnt EC2 machines making code simple and easy to maintain.

2).Monolithic Simulated
   ---------------------
We have simulated the monolithic pattern using the load balancer in such way that entire product is simulated
into multiple instances routing a set of users to a instance with each instance loaded to differnt port.

3).Cloud Computing Pattern - Serverless
   ------------------------------------
Serverless architecture with Lambda functions offers a powerful way to build scalable, efficient, and 
cost-effective applications without the overhead of managing servers. It is managed and scaled as per the need
from the cloud provider without requiring to pay for Servers and sclability of resources with paying only for 
compute. Instead of provisioning, scaling, and maintaining servers, you focus solely on writing code. The cloud provider automatically handles the operational aspects, 
such as server management, capacity planning, and scaling.

4).Virtualization–Using EC2:
   ---------------------------
This architecture leverages the power of AWS EC2 virtualization for compute and S3 for storage, combined with Load Balancers to efficiently distribute requests across services.
Each service (User Login, Registration, File Upload, Search) is behind an Elastic Load Balancer (ELB).The ELB ensures that traffic is distributed across 
multiple EC2 instances running the service. This helps in achieving scalability, fault tolerance, and handling traffic spikes.

How to run
==========
1).Registration/SignUP
   --------------------
   Need to register as new user with username in the email format, along with username and password.

2).Login
   ------
   Login using your username and password to the system

3).Search
   -------
   Search using Title, Author and Subject showing agains the search tab. On the right user section, you will find books uploaded by you.
   Once submit button is triggered, it will show up the result in search result.
   
4).Upload
   -------
   In the Upload section provided, you may upload any book or documennt in the section by providing 
   Title, Author and Subject. You may also browse to the relevant document and pdf to further upload any document.
   
   
   
   








 






 