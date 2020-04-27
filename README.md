![Continuous Integration](https://github.com/GoogleCloudPlatform/anthos-finance-demo/workflows/Continuous%20Integration/badge.svg)

# Bank of Anthos

This project simulates a bank's payment processing network using [Anthos](https://cloud.google.com/anthos/).
Bank of Anthos allows users to create artificial accounts and simulate transactions between accounts.
Bank of Anthos was developed to create an end-to-end sample demonstrating Anthos best practices.

## Architecture

![Architecture Diagram](./docs/architecture.png)


| Service                                          | Language      | Description                                                                                                                                  |
| ------------------------------------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [frontend](./src/frontend)                       | Python        | Exposes an HTTP server to serve the website. Contains login page, signup page, and home page.                                                |
| [ledger-writer](./src/ledgerwriter)              | Java          | Accepts and validates incoming transactions before writing them to the ledger.                                                               |
| [balance-reader](./src/balancereader)            | Java          | Provides efficient readable cache of user balances, as read from `ledger-db`.                                                                |
| [transaction-history](./src/transactionhistory)  | Java          | Provides efficient readable cache of past transactions, as read from `ledger-db`.                                                            |
| [ledger-db](./src/ledger-db)                     | Redis Streams | Append-only ledger of all transactions. Comes pre-populated with past transaction data for default user.                                     |
| [user-service](./src/userservice)                | Python        | Manages user accounts and authentication. Signs JWTs used for authentication by other services.                                              |
| [contacts](./src/contacts)                       | Python        | Stores list of other accounts associated with a user. Used for drop down in "Send Payment" and "Deposit" forms (mock, uses hard-coded data). |
| [accounts-db](./src/accounts-db)                 | MongoDB       | Database for user accounts and associated data. Comes pre-populated with default user.                                                       |
| [loadgenerator](./src/loadgenerator)             | Python/Locust | Continuously sends requests imitating users to the frontend. Periodically created new accounts and simulates transactions between them.      |


## Installation

### 1 - Clone the repo

Clone this repository to your local environment.

```
git clone https://github.com/GoogleCloudPlatform/bank-of-anthos.git
```

### 2 - Project setup

[Create a Google Cloud Platform project](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project) or use an existing project. Then, set the Project ID variable.

```
PROJECT_ID=<your-project-id>
```

### 3 - Create a Kubernetes cluster

```
gcloud beta container clusters create bank-of-anthos \
    --project=${PROJECT_ID} --zone=us-central1-b \
    --machine-type=n1-standard-2 --num-nodes=4
```

### 4 - Generate RSA key pair secret

```
openssl genrsa -out jwtRS256.key 4096
openssl rsa -in jwtRS256.key -outform PEM -pubout -out jwtRS256.key.pub
kubectl create secret generic jwt-key --from-file=./jwtRS256.key --from-file=./jwtRS256.key.pub
```

### 5 - Deploy Kubernetes manifests

```
kubectl apply -k manifests/base/
```

After 1-2 minutes, you should see that all the pods are running:

```
kubectl get pods
```

*Example output - do not copy*

```
NAME                                  READY   STATUS    RESTARTS   AGE
accounts-db-6f589464bc-6r7b7          1/1     Running   0          99s
balancereader-797bf6d7c5-8xvp6        1/1     Running   0          99s
contacts-769c4fb556-25pg2             1/1     Running   0          98s
frontend-7c96b54f6b-zkdbz             1/1     Running   0          98s
ledger-db-5b78474d4f-p6xcb            1/1     Running   0          98s
ledgerwriter-84bf44b95d-65mqf         1/1     Running   0          97s
loadgenerator-559667b6ff-4zsvb        1/1     Running   0          97s
transactionhistory-5569754896-z94cn   1/1     Running   0          97s
userservice-78dc876bff-pdhtl          1/1     Running   0          96s
```

### 4 - Get the frontend IP

```
kubectl get svc frontend | awk '{print $4}'
```

*Example output - do not copy*

```
EXTERNAL-IP
35.223.69.29
```

**Note:** you may see a `<pending>` IP for a few minutes, while the GCP load balancer is provisioned.

### 5 - Navigate to the web frontend

Paste the frontend IP into a web browser. You should see a log-in screen:

![](/docs/login.png)

Using the pre-populated username and password fields, log in as `testuser`. You should see a list of transactions, indicating that the frontend can successfully reach the backend transaction services.

![](/docs/transactions.png)


## Local Development

See the [Development Guide](./docs/development.md) for instructions on how to build and develop services locally, and the [Contributing Guide](./CONTRIBUTING.md) for pull request and code review guidelines.

---

This is not an official Google project.

## [WORK IN PROGRESS] Installation with Google Cloud SQL


### 1 - Clone the repo

Clone this repository to your local environment.

```
git clone https://github.com/GoogleCloudPlatform/bank-of-anthos.git
```

### 2 - Project setup

[Create a Google Cloud Platform project](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project) or use an existing project. Then, set the Project ID variable.

```
PROJECT_ID=<your-project-id>
INSTANCE_NAME=<your-cloud-sql-instance-name>
INSTANCE_REGION=<your-cloud-sql-instance-region>
```

### 3 - Create a Kubernetes cluster

```
gcloud beta container clusters create bank-of-anthos \
    --project=${PROJECT_ID} --zone=us-central1-b \
    --machine-type=n1-standard-2 --num-nodes=4
```

### 4 - Create a Cloud SQL Instance

```
gcloud services enable sqladmin.googleapis.com
gcloud beta sql instances create ${INSTANCE_NAME} \
--database-version=POSTGRES_12 --cpu=2 --memory=7680MiB --region=${INSTANCE_REGION}
```

### 5 - Configure Cloud SQL

```
gcloud sql users set-password root --instance=${INSTANCE_NAME} --password=root-pwd
gcloud beta sql databases create accounts-db --instance=${INSTANCE_NAME}
gcloud beta sql users create accounts-admin  --instance=${INSTANCE_NAME} --password=accounts-pwd
gcloud beta sql connect ${INSTANCE_NAME} --user=accounts-admin --database=accounts-db
# EXECUTE INIT SQL SCRIPT located at src/accounts-db/initdb/0-accounts-schema.sql
gcloud beta sql users create ledger-admin  --instance=${INSTANCE_NAME} --password=ledger-pwd
gcloud beta sql connect ${INSTANCE_NAME} --user=ledger-admin --database=ledger-db
# EXECUTE INIT SQL SCRIPT located at src/ledger-db/initdb/0_init_tables.sql
```

### 6 - Create Service Account and Kubernetes Secret for Cloud SQL Proxy

```
gcloud iam service-accounts create csql-svc --display-name "csql-svc"
SA_EMAIL=$(gcloud iam service-accounts list --filter="displayName:csql-svc" --format='value(email)')
gcloud projects add-iam-policy-binding ${PROJECT_ID} --member serviceAccount:$SA_EMAIL --role roles/cloudsql.client
gcloud iam service-accounts keys create csql-sa.json --iam-account
kubectl create secret generic cloudsql-instance-credentials --from-file=./csql-sa.json
```

### 7 - Populate necessary Env Vars for Cloud SQL Proxy

```
cat > manifests/overlays/cloud-sql/csql.env  << EOF
PROJECT_ID=${PROJECT_ID}
INSTANCE_NAME=${INSTANCE_NAME}
INSTANCE_REGION=${INSTANCE_REGION}
EOF
```

### 8 - Generate RSA key pair secret

```
openssl genrsa -out jwtRS256.key 4096
openssl rsa -in jwtRS256.key -outform PEM -pubout -out jwtRS256.key.pub
kubectl create secret generic jwt-key --from-file=./jwtRS256.key --from-file=./jwtRS256.key.pub
```

### 9 - Deploy Kubernetes manifests

```
kustomize build manifests/overlays/cloud-sql | kubectl apply -f -
```

After 1-2 minutes, you should see that all the pods are running:

```
kubectl get pods
```

*Example output - do not copy*

```
NAME                                  READY   STATUS    RESTARTS   AGE
accounts-db-6f589464bc-6r7b7          1/1     Running   0          99s
balancereader-797bf6d7c5-8xvp6        1/1     Running   0          99s
contacts-769c4fb556-25pg2             1/1     Running   0          98s
frontend-7c96b54f6b-zkdbz             1/1     Running   0          98s
ledger-db-5b78474d4f-p6xcb            1/1     Running   0          98s
ledgerwriter-84bf44b95d-65mqf         1/1     Running   0          97s
loadgenerator-559667b6ff-4zsvb        1/1     Running   0          97s
transactionhistory-5569754896-z94cn   1/1     Running   0          97s
userservice-78dc876bff-pdhtl          1/1     Running   0          96s
```

### 10 - Get the frontend IP

```
kubectl get svc frontend | awk '{print $4}'
```

*Example output - do not copy*

```
EXTERNAL-IP
35.223.69.29
```

**Note:** you may see a `<pending>` IP for a few minutes, while the GCP load balancer is provisioned.
