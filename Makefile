# Copyright 2019 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

.-PHONY: cluster deploy deploy-continuous logs checkstyle check-env

ZONE=us-west1-a
CLUSTER=bank-of-anthos

cluster: check-env
	gcloud beta container clusters create ${CLUSTER} \
		--project=${PROJECT_ID} --zone=${ZONE} \
		--machine-type=n1-standard-2 --num-nodes=4 \
		--enable-stackdriver-kubernetes --subnetwork=default \
		--workload-pool=${PROJECT_ID}.svc.id.goog \
		--labels csm=
	gcloud iam service-accounts create cnrm-system
	gcloud projects add-iam-policy-binding ${PROJECT_ID} \
		--member serviceAccount:cnrm-system@${PROJECT_ID}.iam.gserviceaccount.com \
		--role roles/owner
	gcloud iam service-accounts add-iam-policy-binding cnrm-system@${PROJECT_ID}.iam.gserviceaccount.com \
		--member="serviceAccount:${PROJECT_ID}.svc.id.goog[cnrm-system/cnrm-controller-manager]" \
		--role="roles/iam.workloadIdentityUser"
	kubectl apply -f ./config-connector/install-bundle-workload-identity
	kubectl annotate --overwrite serviceaccount cnrm-controller-manager -n cnrm-system \
		iam.gke.io/gcp-service-account=cnrm-system@${PROJECT_ID}.iam.gserviceaccount.com
	kubectl annotate namespace \
		default cnrm.cloud.google.com/project-id=${PROJECT_ID}
	# skaffold run --default-repo=gcr.io/${PROJECT_ID} -l skaffold.dev/run-id=${CLUSTER}-${PROJECT_ID}-${ZONE}

deploy: check-env
	echo ${CLUSTER}
	gcloud container clusters get-credentials --project ${PROJECT_ID} ${CLUSTER} --zone ${ZONE}
	skaffold run --default-repo=gcr.io/${PROJECT_ID} -l skaffold.dev/run-id=${CLUSTER}-${PROJECT_ID}-${ZONE}

deploy-continuous: check-env
	gcloud container clusters get-credentials --project ${PROJECT_ID} ${CLUSTER} --zone ${ZONE}
	skaffold dev --default-repo=gcr.io/${PROJECT_ID}

checkstyle:
	mvn checkstyle:check
	# disable warnings: import loading, todos, function members, duplicate code, public methods
	pylint --disable=F0401 --disable=W0511 --disable=E1101 --disable=R0801 --disable=R0903  ./src/*/*.py

check-env:
ifndef PROJECT_ID
	$(error PROJECT_ID is undefined)
endif
