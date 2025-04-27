import _differenceBy from 'lodash/differenceBy';

/**
 * Apply generic stats to a minimally "sorted by service type" object.
 *
 * Attempt to avoid business specific logic by looping and using each "service type" as a diff base
 * to pull unique providers and account ids.
 */
const billingMetrics = ((baseMetrics, other) => {
  const serviceTypeProviderAccountIdMetrics = {};

  console.log('>>>>>>>> BASE METRICS 001', baseMetrics);
  console.log('>>>>>>>> BASE METRICS 002', other);

  const baseMetricsValues = Object.values(baseMetrics);
  baseMetricsValues.forEach((typeArr, index) => {
    const newTemp = baseMetricsValues.toSpliced(index, 1);
    // const typeArr = [obj];
    const serviceType = typeArr[0].type;

    serviceTypeProviderAccountIdMetrics[serviceType] = {
      accounts: _differenceBy(typeArr, ...newTemp, 'id'),
      providers: _differenceBy(typeArr, ...newTemp, 'provider'),
      firstProvider: undefined,
      firstProviderAccount: undefined,
      firstProviderNumberAccounts: 0,
      numberProviders: 0
    };

    const aggregatedAccountsProviders = [
      ...serviceTypeProviderAccountIdMetrics[serviceType].accounts,
      ...serviceTypeProviderAccountIdMetrics[serviceType].providers
    ];

    const filterAggregatedAccountsProviders = {};
    aggregatedAccountsProviders.forEach(({ id, provider }) => {
      filterAggregatedAccountsProviders[provider] ??= new Set();
      filterAggregatedAccountsProviders[provider].add(id);
    });

    console.log('>>>>> LOOP 001', aggregatedAccountsProviders);
    console.log('>>>>> LOOP 002', filterAggregatedAccountsProviders);

    const numberProviders = Object.keys(filterAggregatedAccountsProviders).length;
    const [firstProvider, firstProviderAccounts = []] = Object.entries(filterAggregatedAccountsProviders).shift();
    const firstProviderNumberAccounts = firstProviderAccounts.size;
    const firstProviderAccount = Array.from(firstProviderAccounts)[0];

    serviceTypeProviderAccountIdMetrics[serviceType].numberProviders = numberProviders;
    serviceTypeProviderAccountIdMetrics[serviceType].firstProvider = firstProvider;
    serviceTypeProviderAccountIdMetrics[serviceType].firstProviderNumberAccounts = firstProviderNumberAccounts;
    serviceTypeProviderAccountIdMetrics[serviceType].firstProviderAccount = firstProviderAccount;

    if (serviceTypeProviderAccountIdMetrics[serviceType].accounts.length) {
      serviceTypeProviderAccountIdMetrics[serviceType].hasUniqueAccounts = true;
    }

    if (serviceTypeProviderAccountIdMetrics[serviceType].providers.length) {
      serviceTypeProviderAccountIdMetrics[serviceType].hasUniqueProviders = true;
    }
  });

  return serviceTypeProviderAccountIdMetrics;
};

const rhsmHelpers = {
  billingMetrics
};

export { rhsmHelpers as default, rhsmHelpers, billingMetrics };
