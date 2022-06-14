export function supportProperJunoAddress (Assertion: Chai.AssertionStatic): void {
  Assertion.addProperty('properJunoAddress', function (this: any) { // eslint-disable-line  @typescript-eslint/no-explicit-any
    const subject = this._obj as string;
    this.assert(
      /^juno[0-9-a-fA-F]{39}$/.test(subject),
      `Expected "${subject}" to be a proper juno address`,
      `Expected "${subject}" not to be a proper juno address`,
      'proper juno address (eg.: juno123456789012345678901234567890123456789)',
      subject
    );
  });
}
