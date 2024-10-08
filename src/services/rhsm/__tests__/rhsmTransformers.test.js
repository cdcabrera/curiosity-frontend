import { rhsmTranformers } from '../rhsmTranformers';
import { rhsmConstants } from '../rhsmConstants';

describe('RHSM Transformers', () => {
  it('should have specific RHSM response transformers', () => {
    expect(rhsmTranformers).toMatchSnapshot('specific transformers');
  });

  it('should attempt to parse an instances response', () => {
    expect(
      rhsmTranformers.instances({
        [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
          {
            [rhsmConstants.RHSM_API_RESPONSE_INSTANCES_DATA_TYPES.MEASUREMENTS]: [1000, 0.0003456, 2]
          }
        ],
        [rhsmConstants.RHSM_API_RESPONSE_META]: {
          [rhsmConstants.RHSM_API_RESPONSE_INSTANCES_META_TYPES.MEASUREMENTS]: ['c', 'a', 'b']
        }
      })
    ).toMatchSnapshot('instances');
  });

  it('should attempt to parse a tally response', () => {
    expect(rhsmTranformers.tally()).toMatchSnapshot('tally');
  });
});
