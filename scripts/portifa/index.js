import trace from 'console.js'
import {states} from 'portifa/states'

class Aplication {
  redditURL = 'ae';

  constructor(){
    this.redditURL = 'http://www.reddit.com/r/perfectloops/top.json?sort=top&t=week';
    trace('RedditURL:', this.redditURL);
    trace('States:', states);
  }

  load(){
  }
}

export default new Aplication();
