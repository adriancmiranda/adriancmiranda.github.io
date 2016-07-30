import {states} from 'portifa/states'

class Aplication {
  redditURL = 'ae';

  constructor(){
    this.redditURL = 'http://www.reddit.com/r/perfectloops/top.json?sort=top&t=week';
    console.log('redditURL:', this.redditURL);
    console.log('states:', states);
  }

  load(){
  }
}

export default new Aplication();
