import React, { useState, useEffect } from "react";
import { getLogger } from "../../utils/logger";
import css from "./TokenSideBar.scss";
import TokenSideBarHolder from "./TokenSideBarHolder";
import TokenSideBarBeneficiary from "./TokenSideBarBeneficiary";
import TokenSideBarNoMatch from "./TokenSideBarNoMatch";
import { changeHolder, endorseBeneficiaryTransfer, endorseTransfer, surrenderToken } from "../../services/token";

const { trace, error } = getLogger("component:TokenSideBarContent");
import getUserRoles, { UserRole } from "../../utils/UserRolesUtil";

interface TokenSideBarContentProps {
  adminAddress: string;
  beneficiaryAddress: string;
  holderAddress: string;
  approvedBeneficiaryAddress: string;
  registryAddress: string;
}

const TokenSideBarContent = ({
  adminAddress,
  beneficiaryAddress,
  holderAddress,
  approvedBeneficiaryAddress,
  registryAddress
}: TokenSideBarContentProps) => {
  const userRole = getUserRoles({ adminAddress, holderAddress, beneficiaryAddress });
  const [fieldValue, setFieldValue] = useState({
    newHolder: "",
    approvedBeneficiary: approvedBeneficiaryAddress || ""
  });

  trace(`admin address: ${adminAddress}, holder address: ${holderAddress}, beneficiary address: ${beneficiaryAddress}`);
  const [showActionLoader, toggleActionLoader] = useState(false);
  const [actionError, setActionError] = useState(false);
  const isEqualBeneficiaryAndHolder = userRole === UserRole.HolderBeneficiary;
  const showHolder = userRole === UserRole.Holder || isEqualBeneficiaryAndHolder;
  const showBeneficiary = userRole === UserRole.Beneficiary && !isEqualBeneficiaryAndHolder;
  const showNoAccess = userRole === UserRole.NoMatch;

  useEffect(() => {
    setFieldValue({ ...fieldValue, ...{ approvedBeneficiary: approvedBeneficiaryAddress } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvedBeneficiaryAddress]);

  const handleInputChange = (e: any) => {
    setFieldValue({ ...fieldValue, ...{ [e.target.name]: e.target.value } });
  };

  const handleFormActions = async (fn: Function, value = "") => {
    try {
      setActionError(false);
      toggleActionLoader(true);
      const hash = await fn(value);
      trace(`transaction mined hash: ${hash}`);
      toggleActionLoader(false);
    } catch (e) {
      error(`handle action error ${JSON.stringify(e)}`);
      toggleActionLoader(false);
      setActionError(e.message || e.reason);
    }
  };

  const approveChangeBeneficiary = () => {
    const { approvedBeneficiary } = fieldValue;
    handleFormActions(endorseTransfer, approvedBeneficiary);
  };

  const transferHoldership = async () => {
    const { newHolder } = fieldValue;
    handleFormActions(changeHolder, newHolder);
  };

  const changeBeneficiary = () => {
    const { approvedBeneficiary } = fieldValue;
    handleFormActions(endorseBeneficiaryTransfer, approvedBeneficiary);
  };

  const surrenderDocument = () => {
    handleFormActions(surrenderToken);
  };

  return (
    <>
      {showActionLoader && (
        <div className={css.overlay}>
          <div className={css.loader} />
        </div>
      )}
      {!showActionLoader && showNoAccess && <TokenSideBarNoMatch />}
      {actionError && <li className={css.error}> {actionError} </li>}
      {showHolder && (
        <TokenSideBarHolder
          isEqualBeneficiaryAndHolder={isEqualBeneficiaryAndHolder}
          approvedBeneficiaryAddress={fieldValue.approvedBeneficiary}
          registryAddress={registryAddress}
          newHolder={fieldValue.newHolder}
          handleInputChange={handleInputChange}
          transferHoldership={transferHoldership}
          changeBeneficiary={changeBeneficiary}
          surrenderDocument={surrenderDocument}
        />
      )}
      {showBeneficiary && (
        <TokenSideBarBeneficiary
          setBeneficiary={handleInputChange}
          approveChangeBeneficiary={approveChangeBeneficiary}
          approvedBeneficiary={fieldValue.approvedBeneficiary}
        />
      )}
    </>
  );
};

export default TokenSideBarContent;