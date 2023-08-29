import * as React from 'react';
import { Checkmark32Regular, Checkmark32Filled, Copy32Regular, CheckboxChecked24Regular } from '@fluentui/react-icons';
import {
    makeStyles,
    mergeClasses,
    Button,
    FluentProvider,
    webLightTheme,
    Input,
    InputProps,
    useId,
    shorthands,
    tokens,
    ColorPaletteTokens,
    Overflow,
} from '@fluentui/react-components';
import { useState } from 'react';

export interface ICreateFromLookupProps {
    lookupField: ComponentFramework.PropertyTypes.LookupProperty;
    utils: ComponentFramework.Utility;
    isDisabled: boolean;
    currentValue: string
}

export interface ICreateFromLookupState {
    currentValue: string;
    overlayHidden: boolean;
    iconBackground: string;
}

interface IClipboardClassObject {
    clipboardIcon: string;
    textbox: string;
    iconWrapper: string;
    textboxOverlay: string;
}

const useStyles = makeStyles({
    stack: {
        // must be merged with stackHorizontal or stackVertical
        display: 'flex',
        flexWrap: 'nowrap',
        width: '100%',
        height: 'fit-content',
        boxSizing: 'border-box',
        '> *': {
            textOverflow: 'ellipsis',
        },
    },
    stackHorizontal: {
        // overrides for horizontal stack
        flexDirection: 'row',
        marginLeft: '0px',
        '> :not(:last-child)': {
            marginRight: '1px',
        },
    },
    stackVertical: {
        // overrides for vertical stack
        flexDirection: 'column',
        marginLeft: '5px',
        '> :not(:first-child)': {
            marginTop: '10px',
        },
    },
    stackitem: {
        height: 'fit-content',
        width: '100%',
        alignSelf: 'right',
        flexShrink: 1,
    },
    stackitemSliderVertical: {
        alignSelf: 'left',
        marginLeft: '10px',
        flexShrink: 1,
    },
    stackitemBadgeVertical: {
        alignSelf: 'left',
        marginLeft: '5px',
        flexShrink: 1,
    },
    tooltip: {
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingTop: '0px',
        paddingBottom: '0px',
    },
    overflow: {
        color: 'forestgreen',
        scale: 1.5,
    },
    icon: {
        scale: 1.3,
    },
    input: {
        ...shorthands.border('0px', 'solid', tokens.colorNeutralStroke1),
        backgroundColor: '#f5f5f5',
    },
});

const CreateFromLookupApp = (props: ICreateFromLookupProps): JSX.Element => {
    const classes = useStyles();
    const stackClasses = mergeClasses(classes.stack, classes.stackHorizontal);
    const overflowClass = mergeClasses(classes.overflow, classes.stackitem);
    const inputClass = mergeClasses(classes.input, classes.stackitem);
    const iconClass = mergeClasses(classes.icon, classes.stackitem);

    const id = useId();
    const [inputValue, setInputValue] = useState(props.currentValue);
    const [state, setState] = useState<ICreateFromLookupState>({
        currentValue: '',
        overlayHidden: true,
        iconBackground: 'transparent',
    });
    const onKeyFunction: InputProps['onKeyDown'] = (key) => {
        console.log(inputValue)
    };

    const iconOnClick = () => {
        setState((state) => ({ ...state, overlayHidden: false, iconBackground: 'lightgreen' }));
        setTimeout(() => {
            setState((state) => ({ ...state, overlayHidden: true, iconBackground: 'transparent' }));
        }, 1000);
    };

    const showIcon = () => {
        if (state.overlayHidden) {
            return <Copy32Regular className={iconClass}></Copy32Regular>;
        } else {
            return <Checkmark32Filled className={overflowClass}></Checkmark32Filled>;
        }
    };

    return (
        <FluentProvider theme={webLightTheme}>
            <div className={stackClasses}>
                <Input id={id} readOnly={props.isDisabled} className={inputClass} value={inputValue} onKeyDown={onKeyFunction} onChange={e => e.target.value} />
                <Button className={classes.stackitem} icon={showIcon()} onClick={iconOnClick}></Button>
            </div>
        </FluentProvider>
    );
};

export default CreateFromLookupApp;
