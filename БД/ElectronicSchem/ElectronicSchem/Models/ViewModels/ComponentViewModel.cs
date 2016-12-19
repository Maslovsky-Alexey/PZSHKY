using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ElectronicSchem.Models.ElectronicSchemModels.Components;


namespace ElectronicSchem.Models.ViewModels
{
    public class ComponentViewModel
    {
        public string name { get; set; }

        public string positionx { get; set; }

        public string positiony { get; set; }

        public string url { get; set; }

        public int width { get; set; }

        public int height { get; set; }

        public int rotation { get; set; }

        public virtual ICollection<PropertyViewModel> properties { get; set; }

        public virtual ICollection<InputViewModel> inputs { get; set; }

        public ComponentViewModel(ComponentModel component)
        {
            name = component.Name;
            positionx = component.PositionX;
            positiony = component.PositionY;
            url = component.Url;
            width = component.Width;
            height = component.Height;
            rotation = component.Rotation;

            properties = new List<PropertyViewModel>();
            inputs = new List<InputViewModel>();

            for (int i = 0; i < component.Properties.Count; i++)
                properties.Add(new PropertyViewModel(component.Properties.ElementAt(i)));

            for (int i = 0; i < component.Inputs.Count; i++)
                inputs.Add(new InputViewModel(component.Inputs.ElementAt(i)));
        }
    }
}