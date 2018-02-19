/**
 * @file PropertyFieldSliderRangeHost.tsx
 * Renders the controls for PropertyFieldSliderRange component
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import * as React from 'react';
import { IPropertyFieldSliderRangePropsInternal } from './PropertyFieldSliderRange';
import { Label } from 'office-ui-fabric-react/lib/Label';

/**
 * @interface
 * PropertyFieldSliderRangeHost properties interface
 *
 */
export interface IPropertyFieldSliderRangeHostProps extends IPropertyFieldSliderRangePropsInternal {
}


export interface IPropertyFieldSliderRangeHostState {
}

/**
 * @class
 * Renders the controls for PropertyFieldSliderRange component
 */
export default class PropertyFieldSliderRangeHost extends React.Component<IPropertyFieldSliderRangeHostProps, IPropertyFieldSliderRangeHostState> {

  /**
   * @function
   * Constructor
   */
  constructor(props: IPropertyFieldSliderRangeHostProps) {
    super(props);
    //Bind the current object to the external called onSelectDate method
  }


  /**
   * @function
   * Renders the controls
   */
  public render(): JSX.Element {
    //Renders content
    return (
      <div>
        <Label>{this.props.label}</Label>
        <table style={{paddingTop: '8px', paddingBottom: '10px', width:"100%"}} cellPadding="0" cellSpacing="10">
        <tbody>
        { this.props.showValue == false ?
            <tr><td><div id={this.props.guid + '-slider'}></div></td></tr>
          :
            this.props.orientation == 'vertical' ?
              <tr>
                <td>
                  <div className="ms-Label" style={{marginBottom:'8px'}} id={this.props.guid + '-max'}>{(this.props.initialValue != null && this.props.initialValue != '' && this.props.initialValue.split(",").length == 2) ? this.props.initialValue.split(",")[1] : '0' }</div>
                  <div id={this.props.guid + '-slider'}></div>
                  <div className="ms-Label" style={{marginTop:'8px'}} id={this.props.guid + '-min'}>{(this.props.initialValue != null && this.props.initialValue != '' && this.props.initialValue.split(",").length == 2) ? this.props.initialValue.split(",")[0] : '0' }</div>
                </td>
              </tr>
            :
              <tr>
                <td><div className="ms-Label" id={this.props.guid + '-min'}>{(this.props.initialValue != null && this.props.initialValue != '' && this.props.initialValue.split(",").length == 2) ? this.props.initialValue.split(",")[0] : '0' }</div></td>
                <td><div id={this.props.guid + '-slider'}></div></td>
                <td style={{textAlign: 'right'}}><div className="ms-Label" id={this.props.guid + '-max'}>{(this.props.initialValue != null && this.props.initialValue != '' && this.props.initialValue.split(",").length == 2) ? this.props.initialValue.split(",")[1] : '0' }</div></td>
              </tr>
        }
        </tbody>
        </table>
        <div>
            <div aria-live='assertive' className='ms-u-screenReaderOnly' data-automation-id='error-message'>
              <span id={this.props.guid + '-errorMssg1'}/>
            </div>
            <span>
              <p className='ms-TextField-errorMessage ms-u-slideDownIn20'>
                <span id={this.props.guid + '-errorMssg2'}/>
              </p>
            </span>
        </div>
      </div>
    );
  }
}
