/**
 * @file PropertyFieldAlignPickerHost.tsx
 * Renders the controls for PropertyFieldAlignPicker component
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import * as React from 'react';
import { IPropertyFieldAlignPickerPropsInternal } from './PropertyFieldAlignPicker';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Async } from 'office-ui-fabric-react/lib/Utilities';
import GuidHelper from './GuidHelper';
import styles from './PropertyFields.module.scss';


/**
 * @interface
 * PropertyFieldAlignPickerHost properties interface
 *
 */
export interface IPropertyFieldAlignPickerHostProps extends IPropertyFieldAlignPickerPropsInternal {
}

export interface IPropertyFieldAlignPickerHostState {
  mode?: string;
  overList?: boolean;
  overTiles?: boolean;
  overRight?: boolean;
  errorMessage?: string;
}

/**
 * @class
 * Renders the controls for PropertyFieldAlignPicker component
 */
export default class PropertyFieldAlignPickerHost extends React.Component<IPropertyFieldAlignPickerHostProps, IPropertyFieldAlignPickerHostState> {

  private latestValidateValue: string;
  private async: Async;
  private delayedValidate: (value: string) => void;
  private _key: string;

  /**
   * @function
   * Constructor
   */
  constructor(props: IPropertyFieldAlignPickerHostProps) {
    super(props);
    //Bind the current object to the external called onSelectDate method
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onClickBullets = this.onClickBullets.bind(this);
    this.onClickTiles = this.onClickTiles.bind(this);
    this.onClickRight = this.onClickRight.bind(this);
    this.mouseListEnterDropDown = this.mouseListEnterDropDown.bind(this);
    this.mouseListLeaveDropDown = this.mouseListLeaveDropDown.bind(this);
    this.mouseTilesEnterDropDown = this.mouseTilesEnterDropDown.bind(this);
    this.mouseTilesLeaveDropDown = this.mouseTilesLeaveDropDown.bind(this);
    this.mouseRightEnterDropDown = this.mouseRightEnterDropDown.bind(this);
    this.mouseRightLeaveDropDown = this.mouseRightLeaveDropDown.bind(this);
    this._key = GuidHelper.getGuid();

    this.state = {
      mode: this.props.initialValue != null && this.props.initialValue != '' ? this.props.initialValue : '',
      overList: false, overTiles: false, overRight: false,
      errorMessage: ''
    };

    this.async = new Async(this);
    this.validate = this.validate.bind(this);
    this.notifyAfterValidate = this.notifyAfterValidate.bind(this);
    this.delayedValidate = this.async.debounce(this.validate, this.props.deferredValidationTime);
  }

  /**
   * @function
   * Function called when the component selected value changed
   */
  private onValueChanged(element: any, previous: string, value: string): void {
    this.delayedValidate(value);
  }

  /**
   * @function
   * Validates the new custom field value
   */
  private validate(value: string): void {
    if (this.props.onGetErrorMessage === null || this.props.onGetErrorMessage === undefined) {
      this.notifyAfterValidate(this.props.initialValue, value);
      return;
    }

    if (this.latestValidateValue === value)
      return;
    this.latestValidateValue = value;

    var result: string | PromiseLike<string> = this.props.onGetErrorMessage(value || '');
    if (result !== undefined) {
      if (typeof result === 'string') {
        if (result === undefined || result === '')
          this.notifyAfterValidate(this.props.initialValue, value);

        this.setState({ errorMessage: result});
      }
      else {
        result.then((errorMessage: string) => {
          if (errorMessage === undefined || errorMessage === '')
            this.notifyAfterValidate(this.props.initialValue, value);
          this.setState({ errorMessage: errorMessage });
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
  private notifyAfterValidate(oldValue: string, newValue: string) {
    if (this.props.onPropertyChanged && newValue != null) {
      this.props.properties[this.props.targetProperty] = newValue;
      this.props.onPropertyChanged(this.props.targetProperty, oldValue, newValue);
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

  private onClickBullets(element?: any) {
    var previous = this.state.mode;
    this.setState({ mode: 'left' });
    this.onValueChanged(this, previous, this.state.mode);
  }

  private onClickTiles(element?: any) {
    var previous = this.state.mode;
    this.setState({ mode: 'center' });
    this.onValueChanged(this, previous, this.state.mode);
  }

  private onClickRight(element?: any) {
    var previous = this.state.mode;
    this.setState({ mode: 'right' });
    this.onValueChanged(this, previous, this.state.mode);
  }

  private mouseListEnterDropDown() {
    if (this.props.disabled === true)
      return;
    this.setState({ overList: true });
  }

  private mouseListLeaveDropDown() {
    if (this.props.disabled === true)
      return;
    this.setState({ overList: false });
  }

  private mouseTilesEnterDropDown() {
    if (this.props.disabled === true)
      return;
    this.setState({ overTiles: true });
  }

  private mouseTilesLeaveDropDown() {
    if (this.props.disabled === true)
      return;
    this.setState({ overTiles: false });
  }

  private mouseRightEnterDropDown() {
    if (this.props.disabled === true)
      return;
    this.setState({ overRight: true });
  }

  private mouseRightLeaveDropDown() {
    if (this.props.disabled === true)
      return;
    this.setState({ overRight: false });
  }

  /**
   * @function
   * Renders the controls
   */
  public render(): JSX.Element {

    var backgroundTiles = this.state.overTiles ? '#DFDFDF': '';
    var backgroundLists = this.state.overList ? '#DFDFDF': '';
    var backgroundRight = this.state.overRight ? '#DFDFDF': '';
    if (this.state.mode == 'left')
      backgroundLists = '#EEEEEE';
    if (this.state.mode == 'center')
      backgroundTiles = '#EEEEEE';
    if (this.state.mode == 'right')
      backgroundRight = '#EEEEEE';

    var styleLeft = styles['spcfChoiceFieldField'];
    var styleCenter = styles['spcfChoiceFieldField'];
    var styleRight = styles['spcfChoiceFieldField'];
    if (this.state.mode === 'left')
      styleLeft += ' is-checked';
    else if (this.state.mode === 'center')
      styleCenter += ' is-checked';
    else if (this.state.mode === 'right')
      styleRight += ' is-checked';
    if (this.props.disabled === true) {
      styleLeft += ' is-disabled';
      styleCenter += ' is-disabled';
      styleRight += ' is-disabled';
    }

    //Renders content
    return (
      <div style={{ marginBottom: '8px'}}>
        <Label>{this.props.label}</Label>

        <div style={{display: 'inline-flex'}}>
          <div style={{cursor: this.props.disabled === false ? 'pointer' : 'default', width: '70px', marginRight: '30px', backgroundColor: backgroundLists}}
            onMouseEnter={this.mouseListEnterDropDown} onMouseLeave={this.mouseListLeaveDropDown}>
            <div style={{float: 'left'}}  className={styles['spcfChoiceField']}>
              <input id={"leftRadio-" + this._key} className={styles['spcfChoiceFieldInput']}
                disabled={this.props.disabled}
                onChange={this.onClickBullets} type="radio" role="radio" name={"align-picker-" + this._key}
                defaultChecked={this.state.mode == "left" ? true : false}
                aria-checked={this.state.mode == "left" ? true : false}
                value="left"  style={{cursor: this.props.disabled === false ? 'pointer' : 'default', width: '18px', height: '18px', opacity: 0}}/>
              <label htmlFor={"leftRadio-" + this._key} className={styleLeft}>
                <div className={styles['spcfChoiceFieldInnerField']}>
                  <div className={styles['spcfChoiceFieldIconWrapper']}>
                    <i className='ms-Icon ms-Icon--AlignLeft' aria-hidden="true" style={{cursor: this.props.disabled === false ? 'pointer' : 'default',fontSize:'32px', paddingLeft: '30px', color: this.props.disabled === false ? '#808080' : '#A6A6A6'}}></i>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div style={{cursor: this.props.disabled === false ? 'pointer' : 'default', width: '70px', marginRight: '30px', backgroundColor: backgroundTiles}}
            onMouseEnter={this.mouseTilesEnterDropDown} onMouseLeave={this.mouseTilesLeaveDropDown}>
            <div style={{float: 'left'}} className={styles['spcfChoiceField']}>
              <input id={"centerRadio-" + this._key } className={styles['spcfChoiceFieldInput']}
               onChange={this.onClickTiles} type="radio" name={"align-picker-" + this._key} role="radio"
               disabled={this.props.disabled}
               defaultChecked={this.state.mode == "center" ? true : false}
               aria-checked={this.state.mode == "center" ? true : false}
               value="center"  style={{cursor: this.props.disabled === false ? 'pointer' : 'default', width: '18px', height: '18px', opacity: 0}}/>
              <label htmlFor={"centerRadio-" + this._key } className={styleCenter}>
                <div className={styles['spcfChoiceFieldInnerField']}>
                  <div className={styles['spcfChoiceFieldIconWrapper']}>
                    <i className='ms-Icon ms-Icon--AlignCenter' aria-hidden="true" style={{cursor: this.props.disabled === false ? 'pointer' : 'default',fontSize:'32px', paddingLeft: '30px', color: this.props.disabled === false ? '#808080' : '#A6A6A6'}}></i>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div style={{cursor: this.props.disabled === false ? 'pointer' : 'default', width: '70px', marginRight: '30px', backgroundColor: backgroundRight}}
            onMouseEnter={this.mouseRightEnterDropDown} onMouseLeave={this.mouseRightLeaveDropDown}>
            <div style={{float: 'left'}} className={styles['spcfChoiceField']}>
              <input id={"rightRadio-" + this._key } className={styles['spcfChoiceFieldInput']}
               onChange={this.onClickRight} type="radio" name={"align-picker-" + this._key} role="radio"
               disabled={this.props.disabled}
               defaultChecked={this.state.mode == "right" ? true : false}
               aria-checked={this.state.mode == "right" ? true : false}
               value="right"  style={{cursor: this.props.disabled === false ? 'pointer' : 'default', width: '18px', height: '18px', opacity: 0}}/>
              <label htmlFor={"rightRadio-" + this._key } className={styleRight} >
                <div className={styles['spcfChoiceFieldInnerField']}>
                  <div className={styles['spcfChoiceFieldIconWrapper']}>
                    <i className='ms-Icon ms-Icon--AlignRight' aria-hidden="true" style={{cursor: this.props.disabled === false ? 'pointer' : 'default',fontSize:'32px', paddingLeft: '30px', color: this.props.disabled === false ? '#808080' : '#A6A6A6'}}></i>
                  </div>
                </div>
              </label>
            </div>
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
