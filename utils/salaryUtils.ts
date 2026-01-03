
import { SalaryInfo } from '../types';

export const calculateSalaryComponents = (wage: number): SalaryInfo => {
  const basic = wage * 0.5;
  const hra = basic * 0.5;
  const standardAllowance = 4167;
  const performanceBonus = wage * 0.0833;
  const lta = wage * 0.08333;
  
  // Calculate fixed allowance as the remainder
  const otherSum = basic + hra + standardAllowance + performanceBonus + lta;
  const fixedAllowance = Math.max(0, wage - otherSum);

  const pf = basic * 0.12;
  const pt = 200;

  return {
    wage,
    basic,
    hra,
    standardAllowance,
    performanceBonus,
    lta,
    fixedAllowance,
    pf,
    pt
  };
};
