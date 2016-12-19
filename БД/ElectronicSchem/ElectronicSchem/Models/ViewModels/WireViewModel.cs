using ElectronicSchem.Models.ElectronicSchemModels.Schems;

namespace ElectronicSchem.Models.ViewModels
{
    public class WireViewModel
    {
        public string x1 { get; set; }

        public string y1 { get; set; }

        public string x2 { get; set; }

        public string y2 { get; set; }

        public WireViewModel(WireModel model)
        {
            x1 = model.X1;
            y1 = model.Y1;
            x2 = model.X2;
            y2 = model.Y2;
        }
    }

}