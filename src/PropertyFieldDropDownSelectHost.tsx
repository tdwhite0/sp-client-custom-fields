/**
 * @file PropertyFieldDropDownSelectHost.tsx
 * Renders the controls for PropertyFieldDropDownSelect component
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import * as React from 'react';
import { IPropertyFieldDropDownSelectPropsInternal } from './PropertyFieldDropDownSelect';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Async } from 'office-ui-fabric-react/lib/Utilities';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import GuidHelper from './GuidHelper';

/**
 * @interface
 * PropertyFieldDropDownSelectHost properties interface
 *
 */
export interface IPropertyFieldDropDownSelectHostProps extends IPropertyFieldDropDownSelectPropsInternal {
}

/**
 * @interface
 * PropertyFieldDropDownSelectHost state interface
 *
 */
export interface IPropertyFieldDropDownSelectHostState {
  isOpen: boolean;
  isHoverDropdown?: boolean;
  hoverFont?: string;
  selectedFont?: string[];
  safeSelectedFont?: string[];
  errorMessage?: string;
}

/**
 * @class
 * Renders the controls for PropertyFieldDropDownSelect component
 */
export default class PropertyFieldDropDownSelectHost extends React.Component<IPropertyFieldDropDownSelectHostProps, IPropertyFieldDropDownSelectHostState> {

  private async: Async;
  private delayedValidate: (value: string[]) => void;
  private _key: string;

  /**
   * @function
   * Constructor
   */
  constructor(props: IPropertyFieldDropDownSelectHostProps) {
    super(props);

    //Bind the current object to the external called onSelectDate method
    this.onOpenDialog = this.onOpenDialog.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.toggleHoverLeave = this.toggleHoverLeave.bind(this);
    this.onClickFont = this.onClickFont.bind(this);
    this.mouseEnterDropDown = this.mouseEnterDropDown.bind(this);
    this.mouseLeaveDropDown = this.mouseLeaveDropDown.bind(this);
    this._key = GuidHelper.getGuid();

    //Init the state
    this.state = {
        isOpen: false,
        isHoverDropdown: false,
        errorMessage: ''
      };

    this.async = new Async(this);
    this.validate = this.validate.bind(this);
    this.notifyAfterValidate = this.notifyAfterValidate.bind(this);
    this.delayedValidate = this.async.debounce(this.validate, this.props.deferredValidationTime);

    //Inits the default value
    if (props.initialValue != null && props.initialValue.length > 0  && this.props.options != null) {
      for (var i = 0; i < this.props.options.length; i++) {
        var font = this.props.options[i];
        var found: boolean = false;
        for (var j = 0; j < props.initialValue.length; j++) {
          if (props.initialValue[j] == font.key) {
            found = true;
            break;
          }
        }
        if (found == true)
          font.isSelected = true;
      }
    }
  }

  /**
   * @function
   * Validates the new custom field value
   */
  private validate(value: string[]): void {
    if (this.props.onGetErrorMessage === null || this.props.onGetErrorMessage === undefined) {
      this.notifyAfterValidate(this.props.initialValue, value);
      return;
    }

    var result: string | PromiseLike<string> = this.props.onGetErrorMessage(value || []);
    if (result !== undefined) {
      if (typeof result === 'string') {
        if (result === undefined || result === '')
          this.notifyAfterValidate(this.props.initialValue, value);
        this.state.errorMessage = result;
        this.setState(this.state);
      }
      else {
        result.then((errorMessage: string) => {
          if (errorMessage === undefined || errorMessage === '')
            this.notifyAfterValidate(this.props.initialValue, value);
          this.state.errorMessage = errorMessage;
          this.setState(this.state);
        });
      }
    }
    else {
      this.notifyAfterValidate(this.props.initialValue, value);
    }
  }

  /**
   * @function
   * Notifies the parent Web Part of a property value change
   */
  private notifyAfterValidate(oldValue: string[], newValue: string[]) {
    if (this.props.onPropertyChange && newValue != null) {
      this.props.properties[this.props.targetProperty] = newValue;
      this.props.onPropertyChange(this.props.targetProperty, oldValue, newValue);
      if (!this.props.disableReactivePropertyChanges && this.props.render != null)
        this.props.render();
    }
  }

  /**
   * @function
   * Called when the component will unmount
   */
  public componentWillUnmount() {
    this.async.dispose();
  }

  /**
   * @function
   * Function to open the dialog
   */
  private onOpenDialog(): void {
    if (this.props.disabled === true)
      return;
    this.state.isOpen = !this.state.isOpen;
    this.setState(this.state);
  }

  /**
   * @function
   * Mouse is hover a font
   */
  private toggleHover(element?: any) {
    var hoverFont: string = element.currentTarget.textContent;
    this.state.hoverFont = hoverFont;
    this.setState(this.state);
  }

  /**
   * @function
   * Mouse is leaving a font
   */
  private toggleHoverLeave(element?: any) {
    this.state.hoverFont = '';
    this.setState(this.state);
  }

  /**
   * @function
   * Mouse is hover the fontpicker
   */
  private mouseEnterDropDown(element?: any) {
    this.state.isHoverDropdown = true;
    this.setState(this.state);
  }

  /**
   * @function
   * Mouse is leaving the fontpicker
   */
  private mouseLeaveDropDown(element?: any) {
    this.state.isHoverDropdown = false;
    this.setState(this.state);
  }

  private saveOptions(): void {
    var res: string[] = [];
    this.props.options.map((elm: IDropdownOption) => {
      if (elm.isSelected)
        res.push(elm.key.toString());
    });
    this.delayedValidate(res);
  }

  /**
   * @function
   * User clicked on a font
   */
  private onClickFont(element: React.FormEvent<HTMLElement>, isChecked: boolean) {
    var value: string = (element.currentTarget as any).value;
    var option: IDropdownOption = this.getOption(value);
    option.isSelected = isChecked;
    this.setState(this.state);
    this.saveOptions();
  }

  private getOption(key: string): IDropdownOption {
    for (var i = 0; i < this.props.options.length; i++) {
      var font = this.props.options[i];
      if (font.key === key)
        return font;
    }
    return null;
  }

  /**
   * @function
   * Renders the control
   */
  public render(): JSX.Element {

      //User wants to use the preview font picker, so just build it
      var fontSelect = {
        fontSize: '16px',
        width: '100%',
        position: 'relative',
        display: 'inline-block',
        zoom: 1
      };
      var dropdownColor = '1px solid #c8c8c8';
      if (this.props.disabled === true)
        dropdownColor = '1px solid #f4f4f4';
      else if (this.state.isOpen === true)
        dropdownColor = '1px solid #3091DE';
      else if (this.state.isHoverDropdown === true)
        dropdownColor = '1px solid #767676';
      var fontSelectA = {
        backgroundColor: this.props.disabled === true ? '#f4f4f4' : '#fff',
        borderRadius        : '0px',
        backgroundClip        : 'padding-box',
        border: dropdownColor,
        display: 'block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
        height: '26px',
        lineHeight: '26px',
        padding: '0 0 0 8px',
        color: this.props.disabled === true ? '#a6a6a6' : '#444',
        textDecoration: 'none',
        cursor: this.props.disabled === true ? 'default' : 'pointer'
      };
      var fontSelectASpan = {
        marginRight: '26px',
        display: 'block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        lineHeight: '1.8',
        textOverflow: 'ellipsis',
        cursor: this.props.disabled === true ? 'default' : 'pointer',
        fontWeight: 400
      };
      var fontSelectADiv = {
        borderRadius        : '0 0px 0px 0',
        backgroundClip        : 'padding-box',
        border: '0px',
        position: 'absolute',
        right: '0',
        top: '0',
        display: 'block',
        height: '100%',
        width: '22px'
      };
      var fontSelectADivB = {
        display: 'block',
        width: '100%',
        height: '100%',
        cursor: this.props.disabled === true ? 'default' : 'pointer',
        marginTop: '2px'
      };
      var fsDrop = {
        background: '#fff',
        border: '1px solid #aaa',
        borderTop: '0',
        position: 'absolute',
        top: '29px',
        left: '0',
        width: 'calc(100% - 2px)',
        //boxShadow: '0 4px 5px rgba(0,0,0,.15)',
        zIndex: 999,
        display: this.state.isOpen ? 'block' : 'none'
      };
      var fsResults = {
        margin: '0 4px 4px 0',
        maxHeight: '190px',
        width: 'calc(100% - 4px)',
        padding: '0 0 0 4px',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto'
      };
      var carret: string = this.state.isOpen ? 'ms-Icon ms-Icon--ChevronUp' : 'ms-Icon ms-Icon--ChevronDown';
      var foundSelected = false;
      //Renders content
      return (
        <div style={{ marginBottom: '8px'}}>
          <Label>{this.props.label}</Label>
          <div style={fontSelect as any}>
            <a style={fontSelectA as any} onClick={this.onOpenDialog}
              onMouseEnter={this.mouseEnterDropDown as any} onMouseLeave={this.mouseLeaveDropDown} role="menuitem">
              <span style={fontSelectASpan as any}>
                {this.props.options.map((elm: IDropdownOption, index?: number) => {
                  if (elm.isSelected) {
                    if (foundSelected == false) {
                      foundSelected = true;
                      return (
                          <span key={this._key + '-spanselect-' + index}>{elm.text}</span>
                      );
                    }
                    else {
                      return (
                          <span key={this._key + '-spanselect-' + index}>, {elm.text}</span>
                      );
                    }
                  }
                }
                )}
                {this.state.selectedFont}
              </span>
              <div style={fontSelectADiv as any}>
                <i style={fontSelectADivB} className={carret}></i>
              </div>
            </a>
            <div style={fsDrop as any}>
              <ul style={fsResults as any}>
                {this.props.options.map((font: IDropdownOption, index: number) => {
                  var backgroundColor: string = 'transparent';
                  if (this.state.hoverFont === font.text)
                    backgroundColor = '#eaeaea';
                  var innerStyle = {
                    lineHeight: '80%',
                    padding: '7px 7px 8px',
                    margin: '0',
                    listStyle: 'none',
                    fontSize: '16px',
                    backgroundColor: backgroundColor
                  };
                  return (
                    <li value={font.text}
                      key={this._key + '-dropdownselect-' + index}
                      onMouseEnter={this.toggleHover} role="menuitem" onMouseLeave={this.toggleHoverLeave} style={innerStyle}>
                      <Checkbox
                        defaultChecked={font.isSelected}
                        disabled={this.props.disabled}
                        label={font.text}
                        onChange={this.onClickFont}
                        inputProps={{value: font.key}}
                      />
                    </li>
                  );
                })
                }
              </ul>
            </div>
          </div>
          { this.state.errorMessage != null && this.state.errorMessage != '' && this.state.errorMessage != undefined ?
              <div><div aria-live='assertive' className='ms-u-screenReaderOnly' data-automation-id='error-message'>{  this.state.errorMessage }</div>
              <span>
                <p className='ms-TextField-errorMessage ms-u-slideDownIn20'>{ this.state.errorMessage }</p>
              </span>
              </div>
            : ''}
        </div>
      );
  }
}