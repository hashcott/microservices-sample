## Microservices
**Stack**
- KONG : API Gateway 
- Nodejs : Runtime backend
- Consul : Registry

**Documentations:** [link](https://docs.google.com/document/d/1PHNzaowWYMc00cSW7C70zKPvHVU__3AyiXGFRG5Tsxs/edit?usp=sharing)

**How to install ?**
```
//  Install docker and docker-compose

git clone https://github.com/2ksoft/microservices-sample.git
cd microservices-sample
cd api-gateway 
docker-compose up --build -d

// start all with docker-compose 
```