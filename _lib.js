// description: Library of common functions that you can copy and paste into your own parser

// TEST YOUR RESULT HERE
//return getKeyValueByName(metadataset, "shutdown");
//return getValueByName(metadataset, "shutdown");
//return getValueByPath(metadataset, "MY-APP,infrastructure,switches,model3650,interface,GigabitEthernet1/0/2");
//return getValueByPath(metadataset, "MY-APP,infrastructure,switches,model3650,interface,GigabitEthernet1/0/2,shutdown");
//return flattenSubset(metadataset, flatSubset);
return flattenSubsetWithPath(metadataset, {})


// Function to return all values matching a specific regex in an array
function findValuesMatchingRegex(mds, regex, arr=[]) {
  for (var item in mds) {
    if  ( typeof(mds[item]) === "object") {
      // If we are on a node call recursively the function
      findValuesMatchingRegex (mds[item], regex, arr);
    } else if (regex.test(mds[item]) ) {
      if (! arr.includes(mds[item])) { arr.push(mds[item]); }
    }
  }
  return arr;
}


// Return only keys+values of a metadataset, extracting all nodes object
// the extract format is a flat list
function flattenSubset(mds, flatSubset) {
  for (var item in mds) {
      if (typeof (mds[item]) === "object") {
          flatSubset = flattenSubset(mds[item], flatSubset);
      } else {
          flatSubset[item] = mds[item];
      }
  }
  return flatSubset;
}


// Return only keys+values of a metadataset, removing all nodes object
// the extract format is a flat list including the node path in name
function flattenSubsetWithPath(mds, flatSubset, prefix=[], level=0, pathSeparator=".") {
  for (var item in mds) {
      if (typeof (mds[item]) === "object") {
          prefix[level] = item;
          flatSubset = flattenSubsetWithPath(mds[item], flatSubset, prefix, level+1);
      } else {
          var pre=prefix[0];
          for (var i=1; i<level;i++) {
              pre = pre + pathSeparator + prefix[i];
          }
          flatSubset[pre+pathSeparator+item] = mds[item];
      }
  }
  return flatSubset;
}


// Return the value of a specific key based on its name
// nodes are not taken into account
// If multiple keys with same name, the first value found is returned
// If not found, then "ERROR: NOT FOUND" is returned
function getKeyValueByName(mds, keyName) {
  var value = "ERROR: NOT FOUND";
  for (var item in mds) {
    // check if the key has a value or points to an object
    if  (typeof (mds[item]) === "object") {
      // if value is an object call recursively the function to search this subset of the object
      value = getKeyValueByName(mds[item], keyName);
      if (value != "ERROR: NOT FOUND") { return value; }
    } else {
      // check if the key equals to the search term
      if (item === keyName ) { return mds[item]; }
    }
  }
  return value;
}


// Return the value of a specific key based on its name
// If the key is a node, then it returns a subset
// If multiple keys with same name, the first value found is returned
// If not found, then "ERROR: NOT FOUND" is returned
function getValueByName(mds, name) {
  var value = "ERROR: NOT FOUND";
  for (var item in mds) {
    // check if the key equals to the search term
    if (item === name ) {
      return mds[item];
    }
    // check if the key points to an object
    if  (typeof (mds[item]) === "object") {
      // if value is an object call recursively the function to search this subset of the object
      value = getValueByName(mds[item], name);
      // if key was found, returns it
      if (value != "ERROR: NOT FOUND") { return value; }
      // if not, continue the loop
    }
  }
  return value;
}


// Return the value of a specific key based on its complete path
// If the key is a node, then it returns a subset
// If not found, then "ERROR: NOT FOUND" is returned
function getValueByPath(mds, path, pathSeparator = ',') {
  var pathSteps =  path.split(pathSeparator);
  var subset = mds;
  for (var i = 0; i < pathSteps.length; i++ ) {
    if (subset.hasOwnProperty(pathSteps[i])) {
      subset = subset[pathSteps[i]];
    } else {
      return "ERROR: NOT FOUND";
    }
  }
  return subset;
}


// return a subset of the metadataset based on the name of the node
function getSubsetByNodeName(mds, nodeName) {
  return getValueByName (mds, nodeName);
}

// return a subset of the metadataset based on the complete path of the node
function getSubsetByNodePath(mds, nodePath) {
  return getValueByPath (mds, nodePath);
}


// Returns a subset key, that is a list object, in array format
function mapObjectsToArray( mds, subKey ) {
    var returnedArray = [];
    for (var item in mds[subKey]) {
        returnedArray.push(mds[subKey][item]);
    }
    mds[subKey] = returnedArray;
    return subKey;
}

// Set the value of a specific key based on its name
// nodes are not taken into account
function setValueByName(mds, keyName, keyValue) {
  for (var item in mds) {
    // check if the key has a value or points to an object
    if  (typeof (mds[item]) === "object") {
      // if value is an object call recursively the function to search this subset of the object
      value = setValueByName(mds[item], keyName, keyValue);
    } else {
      // check if the key equals to the search term, then set value
      if (item === keyName ) { mds[item] = keyValue; }
    }
  }
}


// Set the value of a specific key based on its complete path
function setValueByPath(mds, keyPath, , keyValue, pathSeparator = ',') {
  var pathSteps =  keyPath.split(pathSeparator);
  var subset = mds;
  for (var i = 0; i < pathSteps.length; i++ ) {
    if (subset.hasOwnProperty(pathSteps[i])) {
      subset = subset[pathSteps[i]];
    }
  }
  subset = keyValue;
}


// Returns objects.keys in lowercase
function toLowerCaseKeys(obj) {
  return Object.keys(obj).reduce(function(accum, key) {
    accum[key.toLowerCase()] = obj[key];
    return accum;
  }, {});
}
