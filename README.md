Message format adoptiong for usage with @ngx-translate
Changing default parser:

public static forRoot():ModuleWithProviders
{
  return TranslateModule.forRoot
  ({
    parser:
    {
      provide:TranslateParser,
      useClass:LanguageMessageFormatParser
    }
  })
};
