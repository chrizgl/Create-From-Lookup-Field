import * as React from 'react';
import { useCallback, useContext } from 'react';
import { AddCircle32Regular, AddCircle32Filled, Search32Regular, Search32Filled, Open32Regular, Open32Filled } from '@fluentui/react-icons';
import { mergeClasses, Button } from '@fluentui/react-components';
import { useStyles } from '../Styles';
import InputActionBarContext from '../CreateFromLookupContext';

type OpenButtonProps = {
    onClickOpenRequest: () => void;
};

const OpenButton: React.FC<OpenButtonProps> = ({ onClickOpenRequest }) => {
    const contextValue = useContext(InputActionBarContext);
    if (!contextValue) {
        throw new Error('InputActionBarContext is undefined');
    }

    const openState = contextValue.openState;

    const classes = useStyles();
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);

    const showOpenButton = () =>
        openState.overlayHidden ? (
            <Open32Regular className={iconClass}></Open32Regular>
        ) : (
            <Open32Filled className={overflowClass}></Open32Filled>
        );

    return <Button className={classes.stackitem} icon={showOpenButton()} onClick={onClickOpenRequest} />;
};
export default OpenButton;
