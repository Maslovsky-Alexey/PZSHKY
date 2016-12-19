using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ElectronicSchem.Startup))]
namespace ElectronicSchem
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
