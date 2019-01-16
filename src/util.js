import spacetime from 'spacetime';
import emoji from 'emoji-dictionary';
import { wilsonScore } from 'decay';

const bestScore = wilsonScore();

// No-op
export const noop = () => {};
// Generates login configuration based on providers
export const generateLoginConfig = (providers = []) => {
  if (!providers.length) {
    throw new RangeError('One login provider must be provided');
  }
  
  return {
    signInFlow: 'popup',
    signInOptions: providers,
    callbacks: {
      // Avoid redirects after sign-in
      signInSuccessWithAuthResult: () => false
    }
  };
};
// Converts text-specific keywords to unicode
// Uses keyword format :keyword:
export const emojify = (text = '') => {
  if (!text.length) {
    return text;
  }
  
  return text.replace(/(\:{1}[a-zA-Z0-9_]+\:{1})/g, 
    ((match) => emoji.getUnicode(match.replace(/\:/g, '')) || match));
};
// Get estimated time since
export const timeSince = (timestamp = 0) => {
  return spacetime(timestamp).fromNow().rounded || 'Unknown';
};
// Sorts comments by best score
export const sortByBest = (comments = []) => {
  return comments.sort((prev, next) => { 
    return bestScore(prev.upvotes, prev.downvotes) > bestScore(next.upvotes, next.downvotes);
  });
};
