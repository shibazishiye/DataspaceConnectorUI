    import Axios from "axios";

    const POLICY_N_TIMES_USAGE = "N Times Usage";
    const POLICY_DURATION_USAGE = "Duration Usage";
    const POLICY_USAGE_DURING_INTERVAL = "Usage During Interval";

    const POLICY_TYPE_TO_NAME = {
        "ids:NotMoreThanNOffer": POLICY_N_TIMES_USAGE,
        "ids:DurationOffer": POLICY_DURATION_USAGE,
        "ids:IntervalUsageOffer": POLICY_USAGE_DURING_INTERVAL
    };

    const OPERATOR_TYPE_TO_SYMBOL = {
        "idsc:EQ": "=",
        "idsc:LTEQ": "<=",
        "idsc:LT": "<",
    };



    var languages = null;
    var sourcTypes = null;

    export default {
        POLICY_N_TIMES_USAGE,
        POLICY_DURATION_USAGE,
        POLICY_USAGE_DURING_INTERVAL,

        getValue(data, name) {
            let value = "-";
            if (data[name] !== undefined && data[name] != null) {
                if (Array.isArray(data[name])) {
                    value = data[name][0]["@value"];
                } else {
                    value = data[name]["@id"];
                }
            }
            return value;
        },

        convertTypeToPolicyName(type) {
            return POLICY_TYPE_TO_NAME[type];
        },

        convertOperatorTypeToSymbol(type) {
            return OPERATOR_TYPE_TO_SYMBOL[type];
        },

        convertOperatorSymbolToType(symbol) {
            let type = "";
            for (let [key, value] of Object.entries(OPERATOR_TYPE_TO_SYMBOL)) {
                if (value == symbol) {
                    type = key;
                    break;
                }
            }
            return type;
        },

        getLanguages(callback) {
            if (languages == null) {
                Axios.get("http://localhost:80/enum?enumName=Language").then(response => {
                    languages = response.data;
                    callback(languages);
                }).catch(error => {
                    console.log("Error in loadData(): ", error);
                    callback([]);
                });
            } else {
                callback(languages);
            }
        },

        getSourceTypes(callback) {
            if (sourcTypes == null) {
                Axios.get("http://localhost:80/enum?enumName=SourceType").then(response => {
                    sourcTypes = response.data;
                    callback(sourcTypes);
                }).catch(error => {
                    console.log("Error in loadData(): ", error);
                    callback([]);
                });
            } else {
                callback(sourcTypes);
            }
        },

        getBackendConnections(callback) {
            let backendConnections = [];
            Axios.get("http://localhost:80/backend/connections").then(response => {
                var genericEndpoints = response.data;

                for (var genericEndpoint of genericEndpoints) {
                    backendConnections.push({
                        id: genericEndpoint["@id"],
                        endpoint: genericEndpoint,
                        url: genericEndpoint["ids:accessURL"]["@id"]
                    });
                }
                callback(backendConnections);
            }).catch(error => {
                console.log("Error in getBackendConnections(): ", error);
                callback([]);
            });
        },

        createBackendConnection(url, username, password, callback) {
            Axios.post("http://localhost:80/backend/connection?accessUrl=" + url + "&username=" + username + "&password=" + password).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in saveBackendConnection(): ", error);
                callback();
            });
        },

        updateBackendConnection(id, url, username, password, callback) {
            Axios.put("http://localhost:80/backend/connection?id=" + id + "&accessUrl=" + url + "&username=" + username + "&password=" + password).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in saveBackendConnection(): ", error);
                callback();
            });
        },

        deleteBackendConnection(id, callback) {
            Axios.delete("http://localhost:80/backend/connection?id=" + id).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in saveBackendConnection(): ", error);
                callback();
            });
        },

        getApps(callback) {
            let apps = [];
            Axios.get("http://localhost:80/apps").then(response => {
                let appsResponse = response.data;
                for (var app of appsResponse) {
                    apps.push(app[1]);
                }
                callback(apps);
            }).catch(error => {
                console.log("Error in getApps(): ", error);
                callback([]);
            });
        },

        createNewRoute(callback) {
            Axios.post("http://localhost:80/createnewroute").then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in createNewRoute(): ", error);
            });
        },

        setAppRouteStart(routeId, accessUrl, username,
            password, callback) {
            let params = "?routeId=" + routeId + "&accessUrl=" + accessUrl + "&username=" + username + "&password=" + password;
            Axios.post("http://localhost:80/approute/start" + params).then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in setAppRouteStart(): ", error);
            });
        },

        setAppRouteEnd(routeId, accessUrl, callback) {
            let params = "?routeId=" + routeId + "&accessUrl=" + accessUrl;
            Axios.post("http://localhost:80/approute/end" + params).then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in setAppRouteEnd(): ", error);
            });
        },

        createSubRoute(routeId, callback) {
            let params = "?routeId=" + routeId;
            Axios.post("http://localhost:80/approute/subroute" + params).then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in createSubRoute(): ", error);
            });
        },

        setSubRouteEnd(routeId, subRouteId, accessUrl, callback) {
            let params = "?routeId=" + routeId + "&routeStepId=" + subRouteId + "&accessUrl=" + accessUrl;
            Axios.post("http://localhost:80/approute/subroute/end" + params).then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in setSubRouteEnd(): ", error);
            });
        }
    }
