import {expect} from 'chai';
import {getNormalizedConfig} from '../../src/configLoader';

describe('configLoader', function() {
  
  it('normalizes package.json configs', function() {
    
    let config = 'package.json';
    
    let npmStyleConfig = {
      config: {
        commitizen: 'myNpmConfig'
      }
    };
    
    let oldStyleConfig = {
      czConfig: 'myOldConfig'
    };
    
    expect(getNormalizedConfig(config, npmStyleConfig)).to.equal('myNpmConfig');
    expect(getNormalizedConfig(config, oldStyleConfig)).to.equal('myOldConfig');
    
  });
  
  it('normalizes .cz.json configs', function() {
    
    let config = '.cz.json';
    
    let czJsonStyleConfig = {
      path: './path/to/adapter'
    };
    
    expect(getNormalizedConfig(config, czJsonStyleConfig)).to.deep.equal({path: './path/to/adapter'});
    
  });
  
  it('normalizes .czrc configs', function() {
    
    let config = '.czrc';
    
    let czrcStyleConfig = {
      path: './path/to/adapter'
    };
    
    expect(getNormalizedConfig(config, czrcStyleConfig)).to.deep.equal({path: './path/to/adapter'});
    
  });
 
});