"use strict" // @flow

import React from "react"
import ReactDOM from "react-dom"

import { i18n, } from "gracias/i18n"
import { UI_POS, UI_ORIENTATIONS, VALIDATE, } from "./consts"

import { orNull, orUndefined } from "gracias/misc"
import { reactKey } from "gracias/react/misc"
import { classes as cx, addClasses as cxx } from "./useful.jsx"

function mediasrc( src?: string, fileExt?: string ): string { // TODO
  // src types: abs url / rel url / embedded svg by id / data:url /
  // TODO convert "#icon" ~> "data:image/svg+xml;…"
  if( !src ) return ""
  console.assert( typeof src === "string" && src.length >= 2 )

  if( !fileExt &&
      ( fileExt = src.match(/.+(\.[a-z]{1,})$/) ) ) {
    fileExt = fileExt[1]
  }

  switch( src[0] ) {
    case "#" : // ~> by id, from /dist/img/ folder (we're assuming `base href` is `.../html/`)
      return join( "../img/", src.slice(1) );
    case "." :
      if( src[1] === "/" || src[1] === "." ) { // `./etc` or `..etc`: a relative path

      } else {

      }
      return ""; //!!
    case "@" : // ~> absolute path, from ${webroot("host")}/img/ folder
      return join( "img/", src.slice(1) );
  }
  return src;
}

type HR$Props = {
  img?: string,
}
class HR extends React.Component<HR$Props> {
  render() {
    const { img, ...props } = this.props

    let url = mediasrc(img)
    if( url ) {
      return (
          <div { ...props }
               className={ cxx( "hr clearfix", this ) }
               style={{ backgroundImage: "url(" + url + ")" }}>
            <img src={ url } style={{ visibility: "hidden", }} />
          </div>
      );
    }

    return <hr {...props}
               className={ cxx("hr clearfix", this) }/>;
  }
}

class BsBlock extends React.Component {
  render() {
    const { children, ...props } = this.props
    return (
      <div {...props}
           className={ cxx("block", this) }>{ children }</div>
    );
  }
}

class BsRow extends React.Component {
  render() {
    const { children, ...props } = this.props
    return (
      <div {...props}
           className={ cxx("row clearfix", this) }>{ children }</div>
    );
  }
}

class BsSection extends React.Component {
  render() {
    let { title, icon, disabled, children, ...props } = this.props,
        _icon = icon ? <BsIcon icon={ _icon } />
                     : null,
        _heading = ( title || _icon ) ? <h3>{ _icon }{ title }</h3>
                                      : null

    return (
      <section {...{ disabled }} { ...props }
               className={ cxx("subsection", this) }>
        { _heading }
        { children /* TODO Pass disabled to children: `x( children, {disabled} )` */ }
      </section>
    );
  }
}

export type BsLabeledTag$Props = {
    label: ?React.Node,
    pos: $Keys<UI_POS>,
    icon:  ?React.Node,
}

class BsLabeledTag extends React.Component<BsLabeledTag$Props> { ///  An HTML tag with (optionally) an icon, a label and some children
  static defaultProps = {
    pos : "left",
  }
  render() {
    const { label, icon, i, pos, labelPos, tag: Tag, ...props } = this.props,
          _labelPos = UI_POS[labelPos] || UI_POS[pos],
          _icon  = orNull( icon, i ),
          _label = orNull( label )
    let _labelClasses = "";

    switch( this.props.feedback ) { //TODO Make this nicer
      case VALIDATE.success :
        _labelClasses += " has-feedback has-success"; break;
      case VALIDATE.warning :
        _labelClasses += " has-feedback has-warning"; break;
      case VALIDATE.error :
        _labelClasses += " has-feedback has-error"; break;
      default:
    }
    switch( _labelPos  ) {
      case UI_POS.left :
      case UI_POS.top :
        return (
            <Tag { ...props }
                className={ cxx( (_icon ? "-has-icon " : "") + "label-" + _labelPos + _labelClasses, this ) }
                key={ reactKey.call(this) }>
              { _icon && <BsIcon i={ _icon } /> }
              { _label }
              { this.props.children }
            </Tag>
        );
      case UI_POS.right :
      case UI_POS.bottom :
        return (
            <Tag { ...props }
                className={ cxx( (_icon ? "-has-icon " : "") + "label-" + _labelPos, this ) }
                key={ reactKey.call(this) }>
              { this.props.children }
              <BsIcon i={ _icon } />
              { _label }
            </Tag>
        );
      default :
        console.assert( false, "Unsupported `this.props.pos`: `" + _labelPos + "`" );
    }
  }
}

export type BsLabel$Props = {
    ...BsLabeledTag.props,
    value: React.Node, // Alias for label
}

class BsLabel extends React.Component<BsLabel$Props> {
  static defaultProps = {
    tag : "span",
    pos : UI_POS.left
  }
  render() {
    let { value, label, ...props } = this.props;
    if( label == null ) label = value;
    return (
      <BsLabeledTag {...props} label={ label }>{ this.props.children }</BsLabeledTag>
    )
  }
}

function img_name(src) {
  let result = src.slice(1).match(/(?:icon|ico|glyph)-(.*)$/);
  result = result && result[1] || src;
  return result;
  console.assert( imgName );
}

// These are the supported graphics types:
//
//   (font) icon      |  ".iconClass"                                               | ".floppy"
//   (regular) image  |  "/path/to/file" or "./path/to/file" or "../path/to/file"   | "../img/logo.svg"
//   (embedded) SVG   |  "#svgName"                                                 | "#logo"
//

export type BsImage$Props = {
    src: string,
}
class BsImage extends React.Component<BsImage$Props> {
  render() {
    const { src, ...props } = this.props;

    if( src.startsWith("#") ) { // inline-svg?
      return (
          <svg { ...props }>
             <use xlinkHref={ src }/>
          </svg>
      );
    }
    if( src.match(/^\.[^./]/) ) { // .className?
      return <BsIcon icon={ src.slice(1) } />;
    }
//    if( /\.svg$/.test( src ) ) {
//      return <svg { ...props } src={ src }/>;
//    }

    return <img { ...props }
      src={ src }/>;
  }
}

class BsIcon extends React.Component {
  render() {
    const { icon, i, ...props } = this.props;
    let _icon = orNull( icon, i );
    if( typeof _icon !== "string" || _icon == "" ) return _icon || null;

//    if( _icon[0].match(/^[#@./]/) ) { // "#image" or "@image" or "./somepath" or "/somepath"
//      return <BsImage {...props}
//                      className={ cxx( "icon -icon-img icon-" + img_name(_icon), this ) }
//                      src={ _icon }/>;
//    }

    console.assert( _icon.indexOf(" ") < 0, "Invalid icon name '" + _icon + "'" );
    if( _icon.match(/^\.[^/.]/) ) { // ".class"
      _icon = _icon.slice(1)
    }
    return <i { ...props }
              className={ cxx( "icon -icon-font fa fa-" + _icon, this ) } //! TODO Make this configurable
              data-value={ _icon }
              aria-hidden />;
  }
}

export type App$Toast = {
  kind: "error"|"warning"|"info"|"success",
  content: React$Node,

  created_at?: Date,
  shown_at?: Date,
  expires_at?: Date|string,

  onClick?: (ev, item: $Toast) => void,
}

function BsToastItem(props: App$Toast) {
  console.assert( item && item.content );
  return (
    item &&
      ( DateTime.delta(item.expires_at) > 0 ) &&
      ( item.shown_at || ( item.shown_at = Date.now() ) )
      (
        <li key={ reactKey.call(this, index) }
            className={ "-has-" + item.kind }>{ item.content }</li>
      )
  );
}

export type BsToast$Props = {
  items: App$Toast[],
}
class BsToast extends React.Component<BsToast$Props> { // TODO
  render() {
    const { items, className, ...props} = this.props;
//console.log( "BsToast:data", this.props.data );
    return (
      <ul { ...props } className={ cxx( "toasts", this ) }>
        { items && items.map( (item, index) => <BsToastItem { ...item } /> ) }
      </ul>
    );
  }
}

class BsButtonGroup extends React.Component<*> {
  render() {
    const { children, ...props } = this.props
    return (
      <div {...props} className={ cxx("btn-group", this) }>{ children }</div>
    );
  }
}

class BsButtonBar extends React.Component<*> {
  render() {
    const { children, ...props } = this.props
    return (
      <div {...props} className={ cxx("btn-toolbar", this) }>{ children }</div>
    );
  }
}

export type BsInput$Props = {
  labelPos: $Keys<UI_POS>,
  status: ?string, // eg, "error:Duplicate user name" / "warning:Password too small" / "ok:" / ""
//              type={ type }
//              placeholder={ placeholder }
//              key={ reactKey.call(this) }
//              name={ this.props.name }
//              checked={ type in { checkbox:1, radio:1 } && checked }>
}
class BsInput extends React.Component {
  static defaultProps = {
    labelPos : UI_POS.top,
  }

  render() {
    const { labelPos,
            label, icon, placeholder, type, checked,
            className, children, ...props } = this.props;

    //if( labelPos === "inside" ) {
    //  if( !!placeholder ) {
    //    // warn?
    //  } else {
    //    placeholder = label, label = null;
    //    if( icon ) {
    //      !!
    //    }
    //  }
    //}
    //if( placeholder == null && label != null ) placeholder = i18n( label + "..." );
    //if( placeholder != null && label == null ) _labelClasses += " sr-only";

    //this.props.name || console.log("name=",this.props.name);

    const _input = (
      <input {...props}
              className={ cx("form-control", icon && "-has-icon") }
              type={ type }
              placeholder={ placeholder }
              key={ reactKey.call(this) }
              name={ this.props.name }
              checked={ type in { checkbox:1, radio:1 } && checked }>
        { children }
      </input>
    );
    //if(this.props.autoFocus) console.warn(this.props.name, _input);

//    if( typeof this.props.value === "undefined" && typeof this.props.defaultValue !== "undefined" && this.props.onChange ) { // FIXME
//      const el = ??
//      this.props.onChange( el )
//    }
    return (
      <BsLabeledTag tag="label"
                    feedback={ this.props.feedback }
                    className={ cxx("control-label", this) }
                    htmlFor={ this.props.name }
                    icon={ icon }
                    label={ label }
                    pos={ labelPos } >
        { _input }
      </BsLabeledTag>
    );
  }
}

class BsButton extends React.Component {
  render() {
    const { children, type, ...props } = this.props
    const _value = orNull( props.value, props.label );
    // TODO? If `type="submit"` & inside a `<BsForm valid />` do `data-dismiss={ type === "submit" ? "modal" : false }`
    return (
      <BsLabeledTag {...props}
                    tag="button" type={ type || "button" }
                    className={ cxx("btn", this) }
                    data-value={ _value }>
        { children }
      </BsLabeledTag>
    );
  }
}

class BsRadioGroup extends React.Component {
  render() {
    const _legend = this.props.label ? <legend>{ this.props.label }</legend> : null;

    this.props.children.forEach( (item) => {
      item.props.checked = ( this.props.value == item.props.value );
    } )

    return (
        <fieldset {...this.props}>
          { this.props.children }
          { _legend }
        </fieldset>
    );
  }
}

class BsSearchInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="search" />
    );
  }
}

class BsAutoComplete extends React.Component {
  render() {
    const { autoComplete, ...props } = this.props;
    return (
      <BsInput {...props} autoComplete={ autoComplete || "on" } />
    );
  }
}

class BsNumInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="number" />
    );
  }
}

class BsRangeInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="range" />
    );
  }
}

class BsCheckbox extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="checkbox" checked={ this.props.value } labelPos={ this.props.labelPos || "right" } />
    );
  }
}

class BsRadio extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="radio" checked={ this.props.value } />
    );
  }
}

class BsDateTimeUTCInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="datetime" />
    );
  }
}

class BsDateTimeInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="datetime-local" />
    );
  }
}

class BsTimeInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="time" />
    );
  }
}

function _fixDateFormat(date) {
  if( date == null ) return;

  if( typeof date !== "string" || !date.match(/^\d\d\d\d-\d\d-\d\d$/) ) {
    const { year, month, day, } = Date8.from(date).parsePadded()
    return `${year}-${month}-${day}`
  }
}

class BsDateInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props}
               type="date"
               defaultValue={ _fixDateFormat( this.props.defaultValue ) }
               value={ _fixDateFormat( this.props.value ) } />
    );
  }
}
/*
class BsAgeInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props}
               type="date"
               defaultValue={ _fixDateFormat( this.props.defaultValue ) }
               value={ _fixDateFormat( this.props.value ) } />
    );
  }
}
*/
class BsMonthInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="month" />
    );
  }
}

class BsWeekInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="week" />
    );
  }
}

class BsEmailInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="email" />
    );
  }
}

class BsUrlInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="url" />
    );
  }
}

class BsTelInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="tel" />
    );
  }
}

class BsPasswordInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="password" />
    );
  }
}

class BsColorInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="color" />
    );
  }
}

class BsPostalCodeInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="postal-code" />
    );
  }
}

class BsFileInput extends React.Component {
  render() {
    return (
      <BsInput {...this.props} type="file" />
    );
  }
}

class BsForm extends React.Component {
  handleSubmits = ( ev: SyntheticEvent<*> ) => {
    ev.preventDefault()
    this.setState( {} ) // CHECKME Re-render?
    if( this.props.onSubmit ) {
      onSubmit.call( this, ev )
    }
  }
  render() {
    const { children, ...props } = this.props
    // TODO Handle onValidate and pass form_valid to children
    return ( // action={ this.props.action } method={ this.props.method } enctype={ this.props.enctype }
      <form {...props} role="form" onSubmit={ this.handleSubmits }>
        { children }
      </form>
    );
  }
}

class T extends React.PureComponent {
  render() {
    return (
      <table {...this.props} className={ cxx("table table-striped table-hover", this) }>{ this.props.children }</table>
    );
  }
}

class THD extends React.PureComponent {
  render() {
    const { children, ...props } = this.props

    return (
      <thead {...props}>{ children }</thead>
    );
  }
}

class TB extends React.Component {
  render() {
    const { children, ...props } = this.props

    return (
      <tbody {...props}>{ children }</tbody>
    );
  }
}

class TR extends React.PureComponent {
  render() {
    const { children, ...props } = this.props

    return (
      <tr {...props} className={ cxx("no-user-select", this) }>{ children }</tr>
    );
  }
}

class TH extends React.PureComponent {
  render() {
    const { children, icon, label, value, ...props } = this.props,
          _icon = orNull( icon && <BsIcon i={ icon } /> )
          _label = orNull( label, value )

    return (
      <th {...props} data-value={ value } >{ _icon }{ _label } { children }</th>
    );
  }
}

class TD extends React.PureComponent {
  render() {
    const { children, icon, label, value, ...props } = this.props,
          _icon = orNull( icon && <BsIcon i={ icon } /> ),
          _label = orNull( label, value )

    return (
      <td {...props} data-value={ value } >{ _icon }{ _label } { children }</td>
    );
  }
}

export type BsModal$Props = {
  header: ?React.Node,
  footer: ?React.Node,
  backdrop: true | false | "static",

  onShow?: Function,
  onHide?: Function,
}

class BsModal extends React.Component<BsModal$Props> {
  static defaultProps = {
    header:   undefined,
    footer:   undefined,
    backdrop: true,
  }

  componentDidMount() {
    const root = $( ReactDOM.findDOMNode(this) )

    root.modal( { backdrop: this.props.backdrop, keyboard: true, show: false, } )
    if( this.props.onShow ) {
      root.on("show.bs.modal", (ev: Event) => this.props.onShow.call( this, ev ) )
    }
    if( this.props.onHide ) {
      root.on("hide.bs.modal", (ev: Event) => this.props.onHide.call( this, ev ) )
    }
  }
  componentWillUnmount() {
    $( ReactDOM.findDOMNode(this) ).off("hidden")
  }

  close() {
    $( ReactDOM.findDOMNode(this) ).modal("hide")
  }
  open() {
    $( ReactDOM.findDOMNode(this) ).modal("show")
  }
  render() {
    const { header, footer, id, backdrop, ...props } = this.props

    let _header = header,
        _footer = footer
    if( typeof _header === "string" || _header === undefined ) {
      _header = (
          <h3 className="">
                  <button className="-cancel -no-border pull-right" onClick={ this.close } dangerouslySetInnerHTML={{ __html : "&times" }} />
            { _header }
          </h3>
      );
    }
    if( _footer === undefined ) {
      _footer = <BsButton icon="ok" className="-ok" label={ i18n`close|btn` } onClick={ this.close } />
    }

    return ( // NOTE: All these are required by Bootstrap div.modal>div.modal-dialog>div.modal-content>div.modal-header+div.modal-body+div.modal-footer
      <div {...props}
           className={ cxx("modal", this) }
           data-modal-id={ id }
           id={ "modal--" + id }
           role="dialog"
           aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">{ _header }</div>
            <div className="modal-body">
              { this.props.children }
            </div>
            <div className="modal-footer">{ _footer }</div>

          </div>
        </div>
      </div>
    );
  }
}

//class BsModalControl extends React.Component { // TODO Find the proper way
//  //getDefaultProps() {
//  //  return {
//  //  };
//  //},
//  getInitialState() {
//    return {
//      modal: {
//        id: "",
//        node: undefined
//      }
//    };
//  }
//  componentDidMount() {
//    let node = ReactDOM.findDOMNode(this).parentNode,
//        id;
//    while( !(id = node.getAttribute("data-modal-id")) ) {
//      node = node.parentNode;
//    }
//    this.modal = { id, node };
//    //console.log( "modal:", this.state.modal );
//  }
//  componentWillUnmount() {
//    //
//  }
//  render() {
//    let { tag: Tag, children, ...props } = this.props;
//
//    //children = React.Children.map( children, (item) => {
//    //} );
//    return (
//      <Tag { ...props } modal={ this.state.modal }>
//        { children }
//      </Tag>
//    );
//  }
//}

function modalClickHandler(fn: Function) {
  return (ev: Event) => {
    let id,
        node = ev.target
    while( !(id = node.getAttribute("data-modal-id")) ) {
      node = node.parentNode
    }

    const hide = !( fn && fn(ev) ) // Yes, if you return a truthy value from your handler and the modal will not close
    if( hide ) {
      $(node).modal("hide")
    }
  }
}

function MB_ACCEPT_CANCEL( onAccept, onCancel ) {
  const result = (
    <div>
      <BsButton className="-no-border -ok"
                onClick={ modalClickHandler(onAccept) }
                label={ i18n`accept|^btn` } />
      <BsButton className="-no-border -cancel"
                onClick={ modalClickHandler(onCancel) }
                label={ i18n`cancel|^btn` } />
    </div>
  )
  return result;
}
function MB_ALWAYS_ONCE_NEVER( onAcceptAlways, onAcceptOnce, onRefuse ) {
  const result = (
    <div>
      <BsButton className="-no-border -ok -always"
                onClick={ modalClickHandler(onAcceptAlways) }
                label={ i18n`always|^btn` } />
      <BsButton className="-no-border -ok -once"
                onClick={ modalClickHandler(onAcceptOnce) }
                label={ i18n`only once|^btn` } />
      <BsButton className="-no-border -cancel"
                onClick={ modalClickHandler(onRefuse) }
                label={ i18n`refuse|^btn` } />
    </div>
  )
  return result;
}

class BsNavLinks extends React.Component {
  render() {
    return (
      <ul {...this.props}
          className={ cxx("nav navbar-nav", this) }>
        { React.Children.map( this.props.children, (item) => <li key={ reactKey.call(this, item.key) }>{ item }</li> ) }
      </ul>
    );
  }
}

class BsNavSection extends React.PureComponent {
  render() {
    return (
      <div {...this.props}>
        { this.props.children }
      </div>
    );
  }
}

export type BsHamburgerButton$Props = {
  title : React.Node,
}

class BsHambuger extends React.Component<BsHamburgerButton$Props> {
  static defaultProps = {
    title : "Show menu",
  }

  render() {
    const { title, ...props } = this.props
    return (
      <button {...props} type="button" data-toggle="collapse" className="hamburger">
        <span className="sr-only">{ i18n(title) }</span>
        <span style={{ fontWeight: "bold" }}> ⫶ </span>
        {/*<span className="hamburger-line"></span>*/}
        {/*<span className="hamburger-line"></span>*/}
        {/*<span className="hamburger-line"></span>*/}
      </button>
    );
  }
}

class BsNavBar extends React.Component {
  render() {
    let _brand = this.props.brand;
    if( _brand ) {
      if( typeof _brand === "string" ) _brand = <a className="navbar-brand" href={ this.props.home }>{ i18n(_brand) }</a>;
      _brand = <nav className="navbar-header" role="navigation">{ _brand }</nav>;
    }

    return (
      <nav {...this.props} className={ cxx("navbar", this) }>
        <div className="container-fluid">
          <BsHambuger className="navbar-toggle" data-target=".navbar-collapse" /> { _brand }
          <nav className="navbar-collapse collapse" role="navigation">
             { this.props.children }
          </nav>
        </div>
      </nav>
    );
  }
}

//class BsNavSearch extends React.Component {
//  getDefaultProps() {
//    return {
//      placeholder : "Search...",
//    };
//  }
//  render() {
//    return (
//      <form {...this.props}
//            className={ cxx("navbar-form", this) }>
//        <BsSearchInput key={ reactKey.call(this) + ":input" }
//                       placeholder={ i18n(this.props.placeholder) } />
//      </form>
//    );
//  }
//}
//
//class BsSearchBar extends React.Component {
//  getDefaultProps() {
//    return {
//       placeholder: "Search|…",
//    }
//  }
//  getInitialState() {
//    return {
//      searchTerms: "",
//    }
//  }
//
//  handle_ChangedSearchTerms = (ev: Event) => { // TODO
//    const value = ev.target.value,
//          handler = this.props.onSearchTerms;
//    handler && handler(value);
//  }
//
//  render() {
//    return (
//      <BsSection id="site-search-bar"
//                 className="nav-search">
//        <BsSearchInput key={ reactKey.call(this) + ":input" }
//                       className="row"
//                       name="nav-search"
//                       icon="#glyph-search"
//                       onChange={ this.handle_ChangedSearchTerms }
//                       placeholder={ i18n(this.props.placeholder) }
//                       value={ this.state.searchTerms } />
//      </BsSection>
//    );
//  }
//}

class BsSideMenu extends React.Component {
  handle_Blur = (ev: SyntheticEvent<*>) => {
    ev.preventDefault()
    $("#site-side-menu").collapse("hide");
  }

  render() { // TODO use ReactDOM.createPortal()
    const { id, ...props } = this.props

    return ( // have to use <div><ul>... because bootstrap uses display:none but our <ul> might need display:flex
      <div id={ id } className={ cxx("collapse", this) } onBlur={ this.handle_Blur }>
        <ul {...props}>
          { React.Children
                .map( this.props.children, item => <li key={ reactKey.call(this, item.key) }>{ item }</li> )
          }
        </ul>
        <div className="backdrop" onClick={ this.handle_Blur } />
      </div>
    );
  }
}

class TCal extends React.Component { // TODO
  render() {
    return (
      <table {...this.props} className={ cxx("table calendar", this) }>{ this.props.children }</table>
    );
  }
}

export type BsTable$Props = {
  orientation: $Keys<UI_ORIENTATIONS>,
  columns: integer,
  rows: integer,
}

class BsTable extends React.Component<BsTable$Props> { // TODO
  static defaultProps = {
    orientation: UI_ORIENTATIONS.landscape,
    columns:     1,
    rows:        1,
  }

  getInitialState() {
    let columns = toArray(this.props.columns),
        rows = toArray(this.props.rows)

    if( Object.classof(columns[0]) === "Array" ) columns = columns[0]; // in case of [[head],[body]] instead of [[head],...body]
    if( Object.classof(rows[0]) === "Array" ) rows = rows[0]; // in case of [[head],[body],[footer]] instead of [[head],...body,[footer]]

    let headCols = Object.classof(columns[0]) === "Array" ? columns.shift() : [],
        headRows = Object.classof(rows[0]) === "Array" ? rows.shift() : [],
        footRows = Object.classof(rows[rows.length - 1]) === "Array" ? rows.pop() : [];

    return { headCols, columns, headRows, footRows, rows };

    /**/function toArray( value ) {
          if( Object.classof(value) === "Function" ) value = value();
          if( Object.classof(value) === "Number" ) {
            // Make an array
          } else {
            console.assert( Object.classof(value) === "Array" );
          }
          return value;
        }
  }
  render() {
    const _headRows = this.state.headRows
                        .map( (item) => <tr /> ),
          _rows = this.state.rows
                        .map( (item) => <tr /> ),
          _footRows = this.state.footRows
                        .map( (item) => <tr /> );

    return (
      <table {...this.props} className={ cxx("table", this) }>
        { this.props.children }
        <thead>{ _headRows }</thead>
        <tbody>{ _rows     }</tbody>
        <tfoot>{ _footRows }</tfoot>
      </table>
    );
  }
}

export type BsTextArea$Props = {
  columns: integer,
  rows: integer,
}

class BsTextArea extends React.Component {
  static defaultProps = {
    columns: 80,
    rows: 10,
  }
  render() {
    const { label, labelPos, icon, feedback, children, ...props } = this.props;
    return (
      <BsLabeledTag tag="label"
                    feedback={ feedback }
                    className={ cxx("control-label", this) }
                    htmlFor={ this.props.name }
                    icon={ icon }
                    label={ label }
                    pos={ labelPos } >
        <textarea { ...props }>{ this.props.children }</textarea>
      </BsLabeledTag>
    );
  }
}

export type BsSelect$Props = {
  labelPos: $Keys<UI_POS>,
  icon: ?string,
  i: ?string,
  name: ?string,
  placeholder: ?string,
  defaultValue: any,
  value: ?any,
  values: any[],
  onChange: ?Function,
}

class BsSelect extends React.PureComponent { // FIXME
  static defaultProps = {
    labelPos : UI_POS.top
  }
  render() {
//console.warn("BsSelect.render", this.props)
    let { icon, i, name, placeholder, defaultValue, value, values, children, labelPos, onChange, ...props } = this.props,
        _icon = orNull( icon,  i )
    if( values && values.length ) {
      values = values.map( item => {
          console.assert( !!item, "Invalid item found", item )
          let caption,
              value,
              selected
          switch( true ) {
            case typeof item === "string":
              caption = item; break;
            default: //!!
              caption = item.caption || item.name;
              value = (item.id != null) && item.id
              //selected = (typeof item.selected !== "undefined") && item.selected //# <option selected={selected} .../> frowned upon by React
          }
          //vardump`${{item, caption, value}}`;
          return <option value={ value }
                         key={ reactKey.call(this, value) }>{ caption }</option>;
        } );
      children = (children && children.concat(values)) || values;
      if( placeholder != null ) children.unshift( <option value=""
                                                          key={ reactKey.call(this, "option_default") }>{ placeholder }</option> )
    }

    const _input = (
        <select className="form-control"
                defaultValue={ defaultValue } value={ value }
                key={ reactKey.call(this, name) }
                name={ name }
                onChange={ onChange }>
          { children }
        </select>
    );

    return (
      <BsLabeledTag { ...props }
            tag="label" htmlFor={ name }
            pos={ labelPos }
            className={ cxx("control-label", this) }
            i={ _icon }>
        { _input }
      </BsLabeledTag>
    );
  }
}

//<BsTable orientation="portrait" columns={} rows={} renderCell={ (column, row) => "" } />
//
//columns, rows ~> number / array of "strings" / of {objects} = { name: "string", className: "", style: {}, fn: fn(column,row) }
//  array can be flat [item1,...itemN] or [[header1...],[body1,...],[foot1,...]]

export type ALink$Props = {
  label?: string,
  icon?: string,
  i?: string,
  href?: string,
  pageRef?: string|WebPageData,
}
class A extends React.Component<ALink$Props> { // Almost the same as <a /> ~> addition of icon, label and pageRef, plus automatic name, React key and ".btn" class
  render() {
    const { label, icon, i, href, pageRef, ...props } = this.props

    const pageName = (typeof pageRef === "string") ? pageRef
                                                   : pageRef && pageRef.name, // because it can be either the pageName or the page object
          page: WebPageData = pageName && App.webpages.get(pageName)
    if( pageName ) console.assert( page, `<A ... /> links to invalid pageName "${pageName}"` )

    const _href  = pageName && page.path || href,
          _icon  = orNull( icon, i ),
          _label = orNull( label )

    if( !name && pageName ) props.name = pageName

    if( props.disabled ) props.onClick = (ev: React.SyntheticEvent) => { return ev.preventDefault() }

    return (
      <a {...props} className={ cxx( _icon ? "-has-icon" : "", this) }
                    key={ reactKey.call( this, _href || _label ) }
                    href={ _href } >
        <BsIcon i={ _icon } />{ _label }
        { props.children }
      </a>
    );
  }
}

export type BsTabBar$Props = {
  items: React.Component<*>[],
  disabled: boolean,

}
class BsTabBar extends React.Component<BsTabBar$Props> {
  render() {
    const { items, selected, disabled, ...props } = this.props
    return (
        <div { ...props }
             className={ cxx( "tab-bar", this ) }>
          { renderTabs.call( this ) }
          { this.props.children }
        </div>
    );

    /**/function renderTabs() {
          const result = []
          for( const [k,v] of Object.entries(items) ) { // TODO prettier
            result.push( <A name={ k }
                            key={ reactKey.call(this, k) }
                            disabled={ disabled }
                            { ...v }
                            className={ "tab-item"
                                        + ( (k === selected)           ? " selected"   : "" )
                                        + ( (v.label === "" && v.icon) ? " -icon-only" : "" )
                                      } /> )
          }
          return result;
        }
  }
}

export type Bs$Cell$Data = {
  value: React$Node|Promise<React$Node>,
  onClick?: Function,
}
export type Bs$Cell$Callback = (column: integer, row: integer, ) => Bs$Cell$Data
export type BsList$Item = React$Node|React$Node[]

export type BsList$Props = {
  list: Array<BsList$Item>|Bs$Cell$Callback,
  onClick: ?Function,
}
class BsList extends React.Component<BsList$Props> { // TODO
  render() {
    let { list, onClick, ...props } = this.props
    const items = map( list, item => <BsLabel label={ item } /> )
    return (
        <div className="">
          { items }
        </div>
    );
  }
}

export {
  MB_ACCEPT_CANCEL, MB_ALWAYS_ONCE_NEVER,

  mediasrc,

  A,
  T, TB, TH, THD, TR, TD,
  HR,

  BsLabeledTag,
  BsLabel, BsImage, BsIcon,
  BsSection, BsRow, BsBlock,

  BsButton, BsButtonGroup, BsButtonBar,

  BsToast, BsHambuger, BsSideMenu,
  BsTabBar, BsNavBar, BsNavLinks, BsNavSection,

  BsModal, //BsModalControl,
  BsForm,

  BsInput, BsTextArea,
  BsNumInput, BsRangeInput,
  BsEmailInput, BsPasswordInput, BsTelInput, BsUrlInput, BsPostalCodeInput,
  BsDateInput, BsDateTimeInput, BsDateTimeUTCInput, BsTimeInput, BsMonthInput, BsWeekInput, //BsAgeInput,
  BsSearchInput, BsFileInput, BsColorInput,

  BsSelect, BsAutoComplete,

  BsCheckbox, BsRadio, BsRadioGroup,

  BsList,

  TCal,
};
