import {Canvas} from './canvas';

export default typeof Image !== 'undefined' ? Image
  : (Canvas?.Image || null);
