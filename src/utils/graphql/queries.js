export const AAVE_RESERVE_DATA = `
  fragment ReserveData on Reserve {
    id
    underlyingAsset
    name
    symbol
    decimals
    isActive
    isFrozen
    usageAsCollateralEnabled
    borrowingEnabled
    stableBorrowRateEnabled
    baseLTVasCollateral
    optimalUtilisationRate
    averageStableRate
    stableRateSlope1
    stableRateSlope2
    baseVariableBorrowRate
    variableRateSlope1
    variableRateSlope2
    variableBorrowIndex
    variableBorrowRate
    totalScaledVariableDebt
    liquidityIndex
    reserveLiquidationThreshold
    aToken {
      id
    }
    vToken {
      id
    }
    sToken {
      id
    }
    availableLiquidity
    stableBorrowRate
    liquidityRate
    totalPrincipalStableDebt
    totalLiquidity
    utilizationRate
    reserveLiquidationBonus
    price {
      priceInEth
    }
    lastUpdateTimestamp
    stableDebtLastUpdateTimestamp
    reserveFactor
  }

  query ReserveUpdateSubscription($pool: String) {
    reserves(where: {pool: $pool}) {
      ...ReserveData
    }
  }
`;
