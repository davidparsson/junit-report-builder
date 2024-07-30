import * as xmlBuilder from 'xmlbuilder';

export abstract class TestNode {
  private _elementName: string;
  protected _attributes: any;
  private _properties: { name: string; value: string }[];

  /**
   * @param elementName - the name of the XML element
   */
  constructor(elementName: string) {
    this._elementName = elementName;
    this._attributes = {};
    this._properties = [];
  }

  /**
   * @param name
   * @param value
   * @returns this
   */
  property(name: string, value: string): this {
    this._properties.push({ name, value });
    return this;
  }

  /**
   * @param name
   * @returns this
   */
  name(name: string): this {
    this._attributes.name = name;
    return this;
  }

  /**
   * @param timeInSeconds
   * @returns this
   */
  time(timeInSeconds: number): this {
    this._attributes.time = timeInSeconds;
    return this;
  }

  /**
   * @returns the number of test cases
   */
  public abstract getTestCaseCount(): number;

  /**
   * @returns the number of failed test cases
   */
  public abstract getFailureCount(): number;

  /**
   * @returns the number of errored test cases
   */
  public abstract getErrorCount(): number;

  /**
   * @returns the number of skipped test cases
   */
  public abstract getSkippedCount(): number;

  /**
   * @param parentElement - the parent element
   */
  build(parentElement?: xmlBuilder.XMLElement) {
    return this.buildNode(this.createElement(parentElement));
  }

  /**
   * @param parentElement - the parent element
   * @returns the created element
   */
  protected createElement(parentElement?: xmlBuilder.XMLElement): xmlBuilder.XMLElement {
    if (parentElement) {
      return parentElement.ele(this._elementName, this._attributes);
    }
    return this.createRootElement();
  }

  /**
   * @returns the created root element
   */
  private createRootElement(): xmlBuilder.XMLElement {
    const element = xmlBuilder.create(this._elementName, { encoding: 'UTF-8', invalidCharReplacement: '' });
    Object.keys(this._attributes).forEach((key) => {
      element.att(key, this._attributes[key]);
    });
    return element;
  }

  /**
   * @protected
   * @param date
   * @returns {string}
   */
  protected formatDate(date: Date) {
    const pad = (num: number) => (num < 10 ? '0' : '') + num;

    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds())
    );
  }

  /**
   * @param element
   * @returns the created element
   */
  protected buildNode(element: xmlBuilder.XMLElement): xmlBuilder.XMLElement {
    if (this._properties.length) {
      const propertiesElement = element.ele('properties');
      this._properties.forEach((property) => {
        propertiesElement.ele('property', {
          name: property.name,
          value: property.value,
        });
      });
    }
    return element;
  }
}
