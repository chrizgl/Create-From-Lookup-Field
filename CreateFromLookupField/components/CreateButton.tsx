import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { Button, mergeClasses } from '@fluentui/react-components';
import LookupFieldContext from './InputActionBarContext';
import { useStyles } from './Styles';
import IWebApiComponent from '../interfaces/IWebApiComponent';

const CreateButton: React.FC = () => {
    const classes = useStyles();
    const context = useContext(LookupFieldContext);
    if (!context) {
        throw new Error('LookupFieldContext is undefined');
    }
    const inputValue = context.inputValue;
    const createEnabledState = context.createEnabledState;
    const setCreateEnabledState = context.setCreateEnabledState;
    const webApiRequest = context.webApiRequest;



        return <>{createEnabledState && <Button className={classes.stackitem} icon={showCreateButton()} onClick={onClickCreateRequest} />}</>;
    }
}
export default CreateButton;
