export default getNormalizedConfig;

// Given a config and content, plucks the actual
// settings that we're interested in
function getNormalizedConfig (config, content) {
  
  if (content && (config === 'package.json')) {

  // PACKAGE.JSON

    // Use the npm config key, be good citizens
    if (content.config && content.config.commitizen) {
      return content.config.commitizen;
    }
  } else {
    // .cz.json or .czrc 
    return content;
  }
    
}
